import { BotOptions } from "./interfaces";

export const defaultBotOptions:Partial<BotOptions> = {
	instagramBaseUrl: 'https://www.instagram.com',
	enableCookies: true,
	randomizeUserAgent: true,
	maxFollowsPerHour: 20,
	maxFollowsPerDay: 150,
	maxLikesPerDay: 50,
	followUserRatioMin: 0.2,
	followUserRatioMax: 4.0,
	followUserMaxFollowers: null,
	followUserMaxFollowing: null,
	followUserMinFollowers: null,
	followUserMinFollowing: null,
	dontUnfollowUntilTimeElapsed: 3 * 24 * 60 * 60 * 1000,
	excludeUsers: [],
	dryRun: true,
	screenshotOnError: false,
	screenshotsPath: '.',
	logger: console
};