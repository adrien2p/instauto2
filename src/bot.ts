import assert = require('assert');
import UserAgent = require('user-agents');
import { join } from 'path';
import { Browser, Page } from 'puppeteer';
import { readFile, unlink, writeFile } from 'fs/promises';
import {
    AbstractDbAdapter,
    BotOptions,
    defaultBotOptions,
    InstagramApi,
    LanguageMessages,
    Logger,
    Messages,
    UnFollower,
    Utils
} from "./core";

function shuffleArray<T>(arrayIn: T[]): T[] {
    const array = [...arrayIn];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
    return array;
}

export class InstautoCtr {
    private botWorkShiftHours = 16;
    private dayMs = 24 * 60 * 60 * 1000;
    private hourMs = 60 * 60 * 1000;
    private graphqlUserMissing = false;

    private languageMessages = LanguageMessages.en;
    private instagramApi: InstagramApi;
    private logger: Logger;
    private page: Page;

    constructor(private readonly db: AbstractDbAdapter, private readonly browser: Browser, private options: BotOptions) {
    }

    get sleep(): (ms: number, dev) => Promise<string> {
        return Utils.sleep
    }

    async setup(): Promise<void> {
        await this.initContext();

        if (this.options.randomizeUserAgent) {
            const userAgentGenerated = new UserAgent({ deviceCategory: 'desktop' });
            await this.page.setUserAgent(userAgentGenerated.toString());
        }
        if (this.options.userAgent) await this.page.setUserAgent(this.options.userAgent);

        if (this.options.enableCookies) await this.tryLoadCookies();


        // Not sure if we can set cookies before having gone to a page
        await this.page.goto(`${this.options.instagramBaseUrl}/`);
        await Utils.sleep(1000);

        this.logger.log(this.languageMessages.settingInstagramLanguage);
        await this.page.setCookie({ name: 'ig_lang', value: 'en', path: '/', });
        await Utils.sleep(1000);

        await this.page.goto(`${this.options.instagramBaseUrl}/`);
        await Utils.sleep(3000);


        await this.instagramApi.tryPressAcceptCookies();

        if (!(await this.instagramApi.isLoggedIn())) {
            if (!this.options.username || !this.options.password) {
                await this.tryDeleteCookies();
                throw new Error('No longer logged in. Deleting cookies and aborting. Need to provide username/password');
            }

            try {
                await this.instagramApi.tryPressAuthSwitcher();
                await Utils.sleep(1000);
            } catch (err) {
                this.logger.warn('Login page button not found, assuming we have login form');
            }

            // Mobile version https://github.com/mifi/SimpleInstaBot/issues/7
            await this.instagramApi.tryToLogin(this.options.username, this.options.password);

            // Sometimes login button gets stuck with a spinner
            // https://github.com/mifi/SimpleInstaBot/issues/25
            if (!(await this.instagramApi.isLoggedIn())) {
                await Utils.sleep(5000);

                this.logger.log('Still not logged in, trying to reload loading page');
                await this.page.reload();
                await Utils.sleep(5000);

            }

            let warnedAboutLoginFail = false;
            while (!(await this.instagramApi.isLoggedIn())) {
                if (!warnedAboutLoginFail) this.logger.warn('WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.');
                warnedAboutLoginFail = true;
                await Utils.sleep(5000);

            }

            await this.instagramApi.tryPressSaveLogInInfo();
        }

        await this.instagramApi.tryPressNotNowNotificationDialog();

        await this.trySaveCookies();

        const numLikes = (await this.db.getLikedPhotosLastTimeUnit(this.dayMs)).length;
        const numFollowedUnfollowedUsersLastHour = await this.getNumFollowedUsersThisTimeUnit(this.hourMs);
        const numFollowedUnfollowedUsersLastDay = await this.getNumFollowedUsersThisTimeUnit(this.dayMs);
        this.logger.log(`Have followed/unfollowed ${numFollowedUnfollowedUsersLastHour} in the last hour`);
        this.logger.log(`Have followed/unfollowed ${numFollowedUnfollowedUsersLastDay} in the last 24 hours`);
        this.logger.log(`Have liked ${numLikes} images in the last 24 hours`);

        try {
            // eslint-disable-next-line no-underscore-dangle
            const detectedUsername = await this.page.evaluate(() => (window as any)._sharedData.config.viewer.username);
            if (detectedUsername) this.options.username = detectedUsername;
        } catch (err) {
            this.logger.error('Failed to detect username', err);
        }
    }

    setLanguage(LanguageMessages: Messages): void {
        this.languageMessages = LanguageMessages;
    }

    async tryLoadCookies(): Promise<void> {
        try {
            const cookiesBuffer = await readFile(this.options.cookiesPath);
            const cookies = JSON.parse(cookiesBuffer.toString());
            for (const cookie of cookies) {
                if (cookie.name !== 'ig_lang') await this.page.setCookie(cookie);
            }
        } catch (err) {
            this.logger.error('No cookies found');
        }
    }

    async trySaveCookies(): Promise<void> {
        try {
            this.logger.log('Saving cookies');
            const cookies = await this.page.cookies();

            await writeFile(this.options.cookiesPath, JSON.stringify(cookies, null, 2));
        } catch (err) {
            this.logger.error('Failed to save cookies');
        }
    }

    async tryDeleteCookies(): Promise<void> {
        try {
            this.logger.log('Deleting cookies');
            await unlink(this.options.cookiesPath);
        } catch (err) {
            this.logger.error('No cookies to delete');
        }
    }

    public async followUsersFollowers({ usersToFollowFollowersOf, maxFollowsTotal = 150, skipPrivate, enableLikeImages = false, likeImagesMin = 1, likeImagesMax = 2 }) {
        if (!maxFollowsTotal || maxFollowsTotal <= 2) {
            throw new Error(`Invalid parameter maxFollowsTotal ${maxFollowsTotal}`);
        }


        // If maxFollowsTotal turns out to be lower than the user list size, slice off the user list
        const usersToFollowFollowersOfSliced = shuffleArray<string>(usersToFollowFollowersOf).slice(0, maxFollowsTotal);

        // Round up or we risk following none
        const maxFollowsPerUser = Math.floor(maxFollowsTotal / usersToFollowFollowersOfSliced.length) + 1;

        for (const username of usersToFollowFollowersOfSliced) {
            try {
                await this.followUserFollowers(username, {
                    maxFollowsPerUser,
                    skipPrivate,
                    enableLikeImages,
                    likeImagesMin,
                    likeImagesMax,
                });

                await Utils.sleep(10 * 60 * 1000);

                await this.throttle();
            } catch (err) {
                console.error('Failed to follow user followers, continuing', err);
                await this.takeScreenshot();
                await Utils.sleep(60 * 1000);

            }
        }
    }

    public async followCurrentUser(username: string): Promise<void> {
        const elementHandle = await this.instagramApi.getFollowButton();

        if (!elementHandle) {
            if (await this.instagramApi.getUnfollowButton()) {
                this.logger.log('We are already following this user');
                await Utils.sleep(5000);

                return;
            }

            throw new Error('Follow button not found');
        }

        this.logger.log(`Following user ${username}`);

        if (!this.options.dryRun) {
            await elementHandle.click();
            await Utils.sleep(5000);


            await this.checkActionBlocked();

            const elementHandle2 = await this.instagramApi.getUnfollowButton();

            // Don't want to retry this user over and over in case there is an issue https://github.com/mifi/instauto/issues/33#issuecomment-723217177
            const entry = { username, time: new Date().getTime() } as UnFollower;
            if (!elementHandle2) entry.failed = true;

            await this.db.addPrevFollowedUser(entry);

            if (!elementHandle2) {
                this.logger.log('Button did not change state - Sleeping');
                await Utils.sleep(60000);

                throw new Error('Button did not change state');
            }
        }

        await Utils.sleep(1000);

    }

    public async unfollowCurrentUser(username: string): Promise<UnFollower> {
        this.logger.log(`Unfollowing user ${username}`);

        const res = { username, time: new Date().getTime() } as UnFollower;

        const elementHandle = await this.instagramApi.getUnfollowButton();
        if (!elementHandle) {
            const elementHandle2 = await this.instagramApi.getFollowButton();
            if (elementHandle2) {
                this.logger.log('User has been unfollowed already');
                res.noActionTaken = true;
            } else {
                this.logger.log('Failed to find unfollow button');
                res.noActionTaken = true;
            }
        }

        if (!this.options.dryRun) {
            if (elementHandle) {
                await elementHandle.click();
                await Utils.sleep(1000);

                const confirmHandle = await this.instagramApi.getUnfollowConfirmButton();
                if (confirmHandle) await confirmHandle.click();

                await Utils.sleep(5000);


                await this.checkActionBlocked();

                const elementHandle2 = await this.instagramApi.getFollowButton();
                if (!elementHandle2) throw new Error('Unfollow button did not change state');
            }

            await this.db.addPrevUnfollowedUser(res);
        }

        await Utils.sleep(1000);


        return res;
    }

    public async getFollowersOrFollowing({ userId, getFollowers = false, maxFollowsPerUser, maxPages }: {
        userId: number;
        getFollowers: boolean;
        maxFollowsPerUser?: number;
        maxPages?: number;
    }): Promise<string[]> {
        const graphqlUrl = `${this.options.instagramBaseUrl}/graphql/query`;
        const followersUrl = `${graphqlUrl}/?query_hash=37479f2b8209594dde7facb0d904896a`;
        const followingUrl = `${graphqlUrl}/?query_hash=58712303d941c6855d4e888c5f0cd22f`;

        const graphqlVariables = {
            id: userId,
            first: 50,
            after: undefined,
        };

        const outUsers = [];

        let hasNextPage = true;
        let i = 0;

        const shouldProceed = () => {
            if (!hasNextPage) {
                return false;
            }

            const isBelowMaxPages = maxPages === null || maxPages === undefined || i < maxPages;
            const hasNotReachLimitPerUser = outUsers.length < maxFollowsPerUser + 5;
            if (getFollowers) {
                return isBelowMaxPages && hasNotReachLimitPerUser;
            }

            return isBelowMaxPages;
        };

        while (shouldProceed()) {
            const url = `${getFollowers ? followersUrl : followingUrl}&variables=${JSON.stringify(graphqlVariables)}`;
            await this.page.goto(url);
            const json = await this.getPageJson();

            const subPropName = getFollowers ? 'edge_followed_by' : 'edge_follow';

            const pageInfo = json.data.user[subPropName].page_info;
            const { edges } = json.data.user[subPropName];

            edges.forEach(e => outUsers.push(e.node.username));

            graphqlVariables.after = pageInfo.end_cursor;
            hasNextPage = pageInfo.has_next_page;
            i += 1;

            if (shouldProceed()) {
                this.logger.log(`Has more pages (current ${i})`);
                // await Utils.sleep(300);
                //
            }
        }

        return outUsers;
    }

    public async followUserFollowers(username: string, {
        maxFollowsPerUser = 5, skipPrivate = false, enableLikeImages, likeImagesMin, likeImagesMax,
    }: {
        maxFollowsPerUser?: number;
        skipPrivate?: boolean;
        enableLikeImages: boolean;
        likeImagesMin: number;
        likeImagesMax: number;
    }) {
        this.logger.log(`Following up to ${maxFollowsPerUser} followers of ${username}`);

        await this.throttle();

        let numFollowedForThisUser = 0;
        const userData = await this.navigateToUserAndGetData(username);
        let followers = await this.getFollowersOrFollowing({
            userId: userData.id,
            getFollowers: true,
            maxFollowsPerUser
        });

        this.logger.log('Followers', JSON.stringify(followers, null, 4));

        followers = await Utils.filter(followers, async f => !(await this.db.getPrevFollowedUser(f)));

        for (const follower of followers) {
            try {
                if (numFollowedForThisUser >= maxFollowsPerUser) {
                    this.logger.log('Have reached followed limit for this user, stopping');
                    return;
                }

                const graphqlUser = await this.navigateToUserAndGetData(follower);

                const followedByCount = graphqlUser.edge_followed_by.count;
                const followsCount = graphqlUser.edge_follow.count;
                const isPrivate = graphqlUser.is_private;

                this.logger.log('followedByCount: ', followedByCount, 'followsCount: ', followsCount);

                const ratio = followedByCount / (followsCount || 1);

                if (isPrivate && skipPrivate) {
                    this.logger.log('User is private, skipping');
                } else if (
                    (this.options.followUserMaxFollowers != null && followedByCount > this.options.followUserMaxFollowers) ||
                    (this.options.followUserMaxFollowing != null && followsCount > this.options.followUserMaxFollowing) ||
                    (this.options.followUserMinFollowers != null && followedByCount < this.options.followUserMinFollowers) ||
                    (this.options.followUserMinFollowing != null && followsCount < this.options.followUserMinFollowing)
                ) {
                    this.logger.log('User has too many or too few followers or following, skipping.', 'followedByCount:', followedByCount, 'followsCount:', followsCount);
                } else if (
                    (this.options.followUserRatioMax != null && ratio > this.options.followUserRatioMax) ||
                    (this.options.followUserRatioMin != null && ratio < this.options.followUserRatioMin)
                ) {
                    this.logger.log('User has too many followers compared to follows or opposite, skipping');
                } else {
                    await this.followCurrentUser(follower);
                    numFollowedForThisUser += 1;

                    await Utils.sleep(10000);
                    if (!isPrivate && enableLikeImages && !this.hasReachedDailyLikesLimit()) {
                        try {
                            await this.likeCurrentUserImages({ username: follower, likeImagesMin, likeImagesMax });
                        } catch (err) {
                            this.logger.error(`Failed to follow user's images ${follower}`, err);
                            await this.takeScreenshot();
                        }
                    }

                    await Utils.sleep(20000);

                    await this.throttle();
                }
            } catch (err) {
                this.logger.error(`Failed to process follower ${follower}`, err);
                await Utils.sleep(20000);

            }
        }
    }

    public async safelyUnfollowUserList(usersToUnfollow: string[], limit: number): Promise<void> {
        this.logger.log(`Unfollowing ${usersToUnfollow.length} users`);

        let i = 0; // Number of people processed
        let j = 0; // Number of people actually unfollowed (button pressed)

        for (const username of usersToUnfollow) {
            try {
                const userFound = await this.navigateToUser(username);

                if (!userFound) {
                    await this.db.addPrevUnfollowedUser({ username, time: new Date().getTime(), noActionTaken: true });
                    await Utils.sleep(3000);

                } else {
                    const { noActionTaken } = await this.unfollowCurrentUser(username);

                    if (noActionTaken) {
                        await Utils.sleep(3000);

                    } else {
                        await Utils.sleep(15000);

                        j += 1;

                        if (j % 10 === 0) {
                            this.logger.log('Have unfollowed 10 users since last break. Taking a break');
                            await Utils.sleep(10 * 60 * 1000, 0.1);

                        }
                    }
                }

                i += 1;
                this.logger.log(`Have now unfollowed ${i} users of total ${usersToUnfollow.length}`);

                if (limit && j >= limit) {
                    this.logger.log(`Have unfollowed limit of ${limit}, stopping`);
                    return;
                }

                await this.throttle();
            } catch (err) {
                this.logger.error('Failed to unfollow, continuing with next', err);
            }
        }
    }

    public async unfollowNonMutualFollowers({ limit }: { limit?: number; } = {}): Promise<void> {
        this.logger.log('Unfollowing non-mutual followers...');
        const userData = await this.navigateToUserAndGetData(this.options.username);

        const allFollowers = await this.getFollowersOrFollowing({
            userId: userData.id,
            getFollowers: true,
        });
        const allFollowing = await this.getFollowersOrFollowing({
            userId: userData.id,
            getFollowers: false,
        });

        const usersToUnfollow = allFollowing.filter((u) => {
            if (allFollowers.includes(u)) return false; // Follows us
            if (this.options.excludeUsers.includes(u)) return false; // User is excluded by exclude list
            if (this.haveRecentlyFollowedUser(u)) {
                this.logger.log(`Have recently followed user ${u}, skipping`);
                return false;
            }
            return true;
        });

        this.logger.log('Users to unfollow', JSON.stringify(usersToUnfollow, null, 4));

        await this.safelyUnfollowUserList(usersToUnfollow, limit);
    }

    public async unfollowAllUnknown({ limit }: { limit?: number; } = {}): Promise<void> {
        this.logger.log('Unfollowing all except excludes and auto followed');
        const userData = await this.navigateToUserAndGetData(this.options.username);

        const allFollowing = await this.getFollowersOrFollowing({
            userId: userData.id,
            getFollowers: false,
        });

        const usersToUnfollow = await Utils.filter(allFollowing, async u => {
            const prevFollowedUser = this.db.getPrevFollowedUser(u);
            if (prevFollowedUser) return false;
            if (this.options.excludeUsers.includes(u)) return false; // User is excluded by exclude list
            return true;
        });

        this.logger.log('Users to unfollow', JSON.stringify(usersToUnfollow, null, 4));

        await this.safelyUnfollowUserList(usersToUnfollow, limit);
    }

    public async unfollowOldFollowed({ ageInDays, limit }: { ageInDays?: number; limit?: number; } = {}): Promise<number> {
        assert(ageInDays);

        this.logger.log(`Unfollowing currently followed users who were auto-followed more than ${ageInDays} days ago...`);

        const userData = await this.navigateToUserAndGetData(this.options.username);

        const allFollowing = await this.getFollowersOrFollowing({
            userId: userData.id,
            getFollowers: false,
        });

        const usersToUnfollow = (await Utils.filter(allFollowing, async u => {
            return await this.db.getPrevFollowedUser(u) &&
                !this.options.excludeUsers.includes(u) &&
                (new Date().getTime() - (await this.db.getPrevFollowedUser(u)).time) / (1000 * 60 * 60 * 24) > ageInDays;
        })).slice(0, limit);

        this.logger.log('Users to unfollow', JSON.stringify(usersToUnfollow, null, 4));

        await this.safelyUnfollowUserList(usersToUnfollow, limit);

        return usersToUnfollow.length;
    }

    public async listManuallyFollowedUsers(): Promise<string[]> {
        const userData = await this.navigateToUserAndGetData(this.options.username);

        const allFollowing = await this.getFollowersOrFollowing({
            userId: userData.id,
            getFollowers: false,
        });

        return Utils.filter(allFollowing, async u => {
            return !(await this.db.getPrevFollowedUser(u)) && !this.options.excludeUsers.includes(u)
        });
    }

    private async initContext(): Promise<void> {
        this.options = { ...defaultBotOptions, ...this.options };
        this.logger = this.options.logger;
        Utils.logger = this.logger;
        assert(this.options.cookiesPath);
        assert(this.db);
        assert(
            this.options.maxFollowsPerHour * this.botWorkShiftHours >= this.options.maxFollowsPerDay,
            'Max follows per hour too low compared to max follows per day'
        );
        this.instagramApi = new InstagramApi(this.browser, this.logger);
        this.page = await this.instagramApi.startNewPage();
    }

    private async takeScreenshot(): Promise<void> {
        if (!this.options.screenshotOnError) return;
        try {
            const fileName = `${new Date().getTime()}.jpg`;
            this.logger.log('Taking screenshot', fileName);
            await this.page.screenshot({
                path: join(this.options.screenshotsPath, fileName),
                type: 'jpeg',
                quality: 30
            });
        } catch (err) {
            this.logger.error('Failed to take screenshot', err);
        }
    }

    private async onImageLiked({ username, href }: { username: string; href: string; }): Promise<void> {
        await this.db.addLikedPhoto({ username, href, time: new Date().getTime() });
    }

    private async getNumFollowedUsersThisTimeUnit(timeUnit: number): Promise<number> {
        return (await this.db.getFollowedLastTimeUnit(timeUnit)).length
            + (await this.db.getUnfollowedLastTimeUnit(timeUnit)).length;
    }

    private async checkReachedFollowedUserDayLimit(): Promise<void> {
        const reachedFollowedUserDayLimit = (await this.getNumFollowedUsersThisTimeUnit(this.dayMs)) >= this.options.maxFollowsPerDay;
        if (reachedFollowedUserDayLimit) {
            this.logger.log('Have reached daily follow/unfollow limit, waiting 10 min');
            await Utils.sleep(10 * 60 * 1000);
        }
    }

    private async checkReachedFollowedUserHourLimit(): Promise<void> {
        const hasReachedFollowedUserHourLimit = (await this.getNumFollowedUsersThisTimeUnit(this.hourMs)) >= this.options.maxFollowsPerHour;
        if (hasReachedFollowedUserHourLimit) {
            this.logger.log('Have reached hourly follow rate limit, pausing 10 min');
            await Utils.sleep(10 * 60 * 1000);

        }
    }

    private async throttle(): Promise<void> {
        await this.checkReachedFollowedUserDayLimit();
        await this.checkReachedFollowedUserHourLimit();
    }

    private async hasReachedDailyLikesLimit(): Promise<boolean> {
        return (await this.db.getLikedPhotosLastTimeUnit(this.dayMs)).length >= this.options.maxLikesPerDay;
    }

    private async haveRecentlyFollowedUser(username: string): Promise<boolean> {
        const followedUserEntry = await this.db.getPrevFollowedUser(username);
        if (!followedUserEntry) return false; // We did not previously follow this user, so don't know
        return new Date().getTime() - followedUserEntry.time < this.options.dontUnfollowUntilTimeElapsed;
    }

    private async safeGoto(url: string): Promise<boolean> {
        this.logger.log(`Goto ${url}`);
        const response = await this.page.goto(url);
        await Utils.sleep(1000);

        const status = response.status();
        if (status === 200) {
            return true;
        } else if (status === 404) {
            this.logger.log('User not found');
            return false;
        } else if (status === 429) {
            this.logger.error('Got 429 Too Many Requests, waiting...');
            await Utils.sleep(60 * 60 * 1000);

            throw new Error('Aborted operation due to too many requests'); // TODO retry instead
        }
        throw new Error(`Navigate to user returned status ${response.status()}`);
    }

    private async navigateToUser(username: string): Promise<boolean> {
        this.logger.log(`Navigating to user ${username}`);
        return this.safeGoto(`${this.options.instagramBaseUrl}/${encodeURIComponent(username)}`);
    }

    private async getPageJson(): Promise<Record<string, any>> {
        const jsonValue = await (await (await this.page.$('pre')).getProperty('textContent')).jsonValue();
        return JSON.parse(jsonValue as string);
    }

    private async navigateToUserAndGetData(username: string): Promise<any> {
        // https://github.com/mifi/SimpleInstaBot/issues/36
        if (this.graphqlUserMissing) {
            // https://stackoverflow.com/questions/37593025/instagram-api-get-the-userid
            // https://stackoverflow.com/questions/17373886/how-can-i-get-a-users-media-from-instagram-without-authenticating-as-a-user
            const found = await this.safeGoto(`${this.options.instagramBaseUrl}/${encodeURIComponent(username)}?__a=1`);
            if (!found) throw new Error('User not found');

            const json = await this.getPageJson();

            const { user } = json.graphql;

            await this.navigateToUser(username);
            return user;
        }

        await this.navigateToUser(username);

        // eslint-disable-next-line no-underscore-dangle
        const sharedData = await this.page.evaluate(() => (window as any)._sharedData);
        try {
            // eslint-disable-next-line prefer-destructuring
            return sharedData.entry_data.ProfilePage[0].graphql.user;

            // JSON.parse(Array.from(document.getElementsByTagName('script')).find(el => el.innerHTML.startsWith('window.__additionalDataLoaded(\'feed\',')).innerHTML.replace(/^window.__additionalDataLoaded\('feed',({.*})\);$/, '$1'));
            // JSON.parse(Array.from(document.getElementsByTagName('script')).find(el => el.innerHTML.startsWith('window._sharedData')).innerHTML.replace(/^window._sharedData ?= ?({.*});$/, '$1'));
            // Array.from(document.getElementsByTagName('a')).find(el => el.attributes?.href?.value.includes(`${username}/followers`)).innerText
        } catch (err) {
            this.logger.warn('Missing graphql in page, falling back to alternative method...');
            this.graphqlUserMissing = true; // Store as state so we don't have to do this every time from now on.
            return this.navigateToUserAndGetData(username); // Now try again with alternative method
        }
    }

    private async checkActionBlocked(): Promise<void | never> {
        if (await this.instagramApi.isActionBlocked()) {
            this.logger.error(`Action Blocked`);
            await this.tryDeleteCookies();
            const errorMsg = 'Aborted operation due to action blocked';
            this.logger.error(errorMsg);
            throw new Error(errorMsg);
        }
    }

    private async likeCurrentUserImagesPageCode({ dryRun: dryRunIn, likeImagesMin, likeImagesMax }: {
        dryRun: boolean;
        likeImagesMin: number;
        likeImagesMax: number;
    }): Promise<void> {
        const allImages = Array.from(document.getElementsByTagName('a')).filter(el => /instagram.com\/p\//.test(el.href));

        // eslint-disable-next-line no-shadow
        function shuffleArray(arrayIn) {
            const array = [...arrayIn];
            for (let i = array.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
            }
            return array;
        }

        const imagesShuffled = shuffleArray(allImages);

        const numImagesToLike = Math.floor((Math.random() * ((likeImagesMax + 1) - likeImagesMin)) + likeImagesMin);

        (window as any).instautoLog(`Liking ${numImagesToLike} image(s)`);

        const images = imagesShuffled.slice(0, numImagesToLike);

        if (images.length < 1) {
            (window as any).instautoLog('No images to like');
            return;
        }

        for (const image of images) {
            image.click();

            await (window as any).instautoSleep(3000);

            const dialog = document.querySelector('*[role=dialog]');

            if (!dialog) throw new Error('Dialog not found');

            const section = Array.from(dialog.querySelectorAll('section')).find(s => s.querySelectorAll('*[aria-label="Like"]')[0] && s.querySelectorAll('*[aria-label="Comment"]')[0]);

            if (!section) throw new Error('Like button section not found');

            const likeButtonChild = section.querySelectorAll('*[aria-label="Like"]')[0];

            if (!likeButtonChild) throw new Error('Like button not found (aria-label)');

            // eslint-disable-next-line no-inner-declarations
            function findClickableParent(el: any): any | undefined {
                let elAt = el;
                while (elAt) {
                    if (elAt.click) {
                        return elAt;
                    }
                    elAt = elAt.parentElement;
                }
                return undefined;
            }

            const foundClickable = findClickableParent(likeButtonChild);

            if (!foundClickable) throw new Error('Like button not found');

            if (!dryRunIn) {
                foundClickable.click();

                (window as any).instautoOnImageLiked(image.href);
            }

            await (window as any).instautoSleep(3000);

            const closeButtonChild = document.querySelector('button [aria-label=Close]');

            if (!closeButtonChild) throw new Error('Close button not found (aria-label)');

            const closeButton = findClickableParent(closeButtonChild);

            if (!closeButton) throw new Error('Close button not found');

            closeButton.click();

            await (window as any).instautoSleep(5000);
        }

        (window as any).instautoLog('Done liking images');
    }

    private async likeCurrentUserImages({ username, likeImagesMin, likeImagesMax }: {
        username: string;
        likeImagesMin: number;
        likeImagesMax: number;
    }): Promise<void> {
        if (!likeImagesMin || !likeImagesMax || likeImagesMax < likeImagesMin || likeImagesMin < 1) throw new Error('Invalid arguments');

        this.logger.log(`Liking ${likeImagesMin}-${likeImagesMax} user images`);
        try {
            await this.page.exposeFunction('instautoSleep', Utils.sleep);
            await this.page.exposeFunction('instautoLog', (...args) => console.log(...args));
            await this.page.exposeFunction('instautoOnImageLiked', (href) => this.onImageLiked({ username, href }));
        } catch (err) {
        }

        await this.page.evaluate(this.likeCurrentUserImagesPageCode, {
            dryRun: this.options.dryRun,
            likeImagesMin,
            likeImagesMax
        });
    }
}

export const Instauto = async (db: AbstractDbAdapter, browser: Browser, options: BotOptions, languageMessages?: Messages): Promise<InstautoCtr> => {
    const instance = new InstautoCtr(db, browser, options);
    if (languageMessages) {
        instance.setLanguage(languageMessages);
    }
    await instance.setup();
    return instance;
}