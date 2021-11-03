import { BotOptions } from './interfaces';

export const defaultBotOptions:Partial<BotOptions> = {
	dontUnfollowUntilTimeElapsed: 3 * 24 * 60 * 60 * 1000,
	dryRun: true,
	enableCookies: true,
	excludeUsers: [],
	followUserMaxFollowers: null,
	followUserMaxFollowing: null,
	followUserMinFollowers: null,
	followUserMinFollowing: null,
	followUserRatioMax: 4.0,
	followUserRatioMin: 0.2,
	instagramBaseUrl: 'https://www.instagram.com',
	logger: console,
	maxFollowsPerDay: 150,
	maxFollowsPerHour: 20,
	maxLikesPerDay: 50,
	randomizeUserAgent: true,
	screenshotOnError: false,
	screenshotsPath: '.'
};