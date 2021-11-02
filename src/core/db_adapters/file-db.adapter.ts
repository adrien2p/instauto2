import { readFile, writeFile } from 'fs/promises';
import { AbstractDbAdapter } from './index';
import { Utils } from "../utils";
import { Follower, LikedPhoto, LiteLogger, UnFollower } from "../interfaces";

export type FileDbOptions = {
    followedDbPath: string,
    unfollowedDbPath: string,
    likedPhotosDbPath: string,
    logger: LiteLogger
};

export class FileDbAdapter extends AbstractDbAdapter {
	protected readonly logger: LiteLogger;

	private prevFollowedUsers: Record<string, Follower> = {};

	private prevUnfollowedUsers: Record<string, UnFollower> = {};

	private prevLikedPhotos: LikedPhoto[] = [];

	private readonly followedDbPath;

	private readonly unfollowedDbPath;

	private readonly likedPhotosDbPath;

	private _loadingIsComplete = false;
	private _loadingPromise: Promise<void | never>;

	constructor({ followedDbPath, unfollowedDbPath, likedPhotosDbPath, logger }: FileDbOptions = {
		logger: console,
		followedDbPath: null,
		likedPhotosDbPath: null,
		unfollowedDbPath: null
	}) {
		super();
		this.followedDbPath = followedDbPath;
		this.unfollowedDbPath = unfollowedDbPath;
		this.likedPhotosDbPath = likedPhotosDbPath;
		this.logger = logger;
		if (!this.logger) {
			this.logger = console;
		}
		this._loadingPromise = this.tryLoadDb().finally(() => {
			this._loadingIsComplete = true;
		});
	}

	async addLikedPhoto({ username, href, time }: LikedPhoto): Promise<void> {
		this.prevLikedPhotos.push({ username, href, time });
		await this.awaitLoadingIfNecessary();
		await this.trySaveDb();
	}

	async addPrevFollowedUser(follower: Follower): Promise<void> {
		this.prevFollowedUsers[follower.username] = follower;
		await this.awaitLoadingIfNecessary();
		await this.trySaveDb();
	}

	async addPrevUnfollowedUser(unfollower: UnFollower): Promise<void> {
		this.prevUnfollowedUsers[unfollower.username] = unfollower;
		await this.awaitLoadingIfNecessary();
		await this.trySaveDb();
	}

	async getFollowedLastTimeUnit(timeUnit: number): Promise<Follower[]> {
		const now = new Date().getTime();
		return (await this.getPrevFollowedUsers())
			.filter(u => now - u.time < timeUnit);
	}

	async getLikedPhotosLastTimeUnit(timeUnit: number): Promise<LikedPhoto[]> {
		const now = new Date().getTime();
		return (await this.getPrevLikedPhotos())
			.filter(u => now - u.time < timeUnit);
	}

	async getPrevFollowedUser(username: string): Promise<Follower> {
		return this.prevFollowedUsers[username];
	}

	async getUnfollowedLastTimeUnit(timeUnit: number): Promise<UnFollower[]> {
		const now = new Date().getTime();
		return (await this.getPrevUnfollowedUsers())
			.filter(u => now - u.time < timeUnit);
	}

	private async getPrevLikedPhotos(): Promise<LikedPhoto[]> {
		return this.prevLikedPhotos;
	}

	private async getPrevUnfollowedUsers(): Promise<UnFollower[]> {
		return Object.values(this.prevUnfollowedUsers);
	}

	private async getPrevFollowedUsers(): Promise<Follower[]> {
		return Object.values(this.prevFollowedUsers);
	}

	private async tryLoadDb(): Promise<void | never> {
		try {
			this.prevFollowedUsers = Utils.keyBy<Follower>(JSON.parse((await readFile(this.followedDbPath)).toString()), 'username');
		} catch (err) {
			this.logger.warn('No followed database found');
		}
		try {
			this.prevUnfollowedUsers = Utils.keyBy<UnFollower>(JSON.parse((await readFile(this.unfollowedDbPath)).toString()), 'username');
		} catch (err) {
			this.logger.warn('No unfollowed database found');
		}
		try {
			this.prevLikedPhotos = JSON.parse((await readFile(this.likedPhotosDbPath)).toString());
		} catch (err) {
			this.logger.warn('No likes database found');
		}
	}

	private async trySaveDb(): Promise<void | never> {
		try {
			await writeFile(this.followedDbPath, JSON.stringify(Object.values(this.prevFollowedUsers)));
			await writeFile(this.unfollowedDbPath, JSON.stringify(Object.values(this.prevUnfollowedUsers)));
			await writeFile(this.likedPhotosDbPath, JSON.stringify(this.prevLikedPhotos));
		} catch (err) {
			this.logger.error('Failed to save database');
		}
	}

	private async awaitLoadingIfNecessary(): Promise<void> {
		if (!this._loadingIsComplete) {
			return await this._loadingPromise;
		}
		return;
	}
}