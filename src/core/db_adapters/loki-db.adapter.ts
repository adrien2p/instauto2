import { AbstractDbAdapter } from './abstract-db.adapter';
import { Follower, LikedPhoto, LiteLogger, UnFollower } from '../interfaces';

interface TLikeLokiCollection<T = any> {
	insert: (data: T) => T;
	find: (query?: unknown) => (T & any)[];
	findOne: (query?: unknown) => (T & any);
}

interface TLoki {
	getCollection: (string) => TLikeLokiCollection;
	addCollection: (name: string, options?: Record<string, any>) => TLikeLokiCollection;
	saveDatabase: (callback?: (err?: any) => void) => void;
}

export class LokiDbAdapter<T extends TLoki> extends AbstractDbAdapter {
	private readonly collectionNames = {
		followed: 'followed',
		'liked-photos': 'liked-photos',
		unfollowed: 'unfollowed'
	};

	constructor(
        private readonly instance: T,
        protected readonly logger: LiteLogger = console
	) {
		super();
		this.createCollectionsIfNecessary();
	}

	addLikedPhoto({ username, href, time }: LikedPhoto): Promise<void> {
		const collection = this.instance.getCollection(this.collectionNames['liked-photos']);
		return collection.insert({ href, time, username });
	}

	addPrevFollowedUser(follower: Follower): Promise<void> {
		const collection = this.instance.getCollection(this.collectionNames.followed);
		return collection.insert(follower);
	}

	addPrevUnfollowedUser(unfollower: UnFollower): Promise<void> {
		const collection = this.instance.getCollection(this.collectionNames.unfollowed);
		return collection.insert(unfollower);
	}

	getFollowedLastTimeUnit(timeUnit: number): Promise<Follower[]> {
		const now = new Date().getTime();
		const collection = this.instance.getCollection(this.collectionNames.followed);
		const constraint = now - timeUnit;
		return Promise.resolve<Follower[]>(
			collection.find({ time: { '$gte': constraint } })
		);
	}

	getLikedPhotosLastTimeUnit(timeUnit: number): Promise<LikedPhoto[]> {
		const now = new Date().getTime();
		const collection = this.instance.getCollection(this.collectionNames['liked-photos']);
		const constraint = now - timeUnit;
		return Promise.resolve<LikedPhoto[]>(
			collection.find({ time: { '$gte': constraint } })
		);
	}

	getPrevFollowedUser(username: string): Promise<Follower> {
		const collection = this.instance.getCollection(this.collectionNames.followed);
		return Promise.resolve<Follower>(collection.findOne({ username }));
	}

	getUnfollowedLastTimeUnit(timeUnit: number): Promise<UnFollower[]> {
		const now = new Date().getTime();
		const collection = this.instance.getCollection(this.collectionNames.unfollowed);
		const constraint = now - timeUnit;
		return Promise.resolve<LikedPhoto[]>(
			collection.find({ time: { '$gte': constraint } })
		);
	}

	private createCollectionsIfNecessary(): void {
		let shouldSaveDatabase = false;
		for (const collectionName of Object.keys(this.collectionNames)) {
			if (!this.instance.getCollection(collectionName)) {
				this.instance.addCollection(collectionName, { disableMeta: true });
				shouldSaveDatabase = true;
			}
		}
		if (shouldSaveDatabase) {
			this.instance.saveDatabase();
		}
	}
}