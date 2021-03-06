export interface Messages {
    dbNoFollowedDatabase: 'No followed database found' | string;
    dbNoUnfollowedDatabase: 'No unfollowed database found' | string;
    dbNoLikesDatabase: 'No likes database found' | string;
    dbSaveFailed: 'Failed to save database' | string;
    settingInstagramLanguage: 'Setting language to english' | string;
    logginPageButtonNotFound: 'Login page button not found, assuming we have login form' | string;
    stillNotLoggedIn: 'Still not logged in, trying to reload loading page' | string;
    loginFailed: 'WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.' | string;
    haveFollowedInTheLastDay: (value: string | number) => `Have followed/unfollowed ... in the last 24 hours` | string;
    haveFollowedInTheLastHour: (value: string | number) => `Have followed/unfollowed ... in the last hour` | string;
    haveLikedImagesInTheLastDay: (value: string | number) => `Have liked ... images in the last 24 hours` | string;
    usernameDetectionFailed: 'Failed to detect username' | string;
    noCookiesFound: 'No cookies found' | string;
    savingCookies: 'Saving cookies' | string;
    savingCookiesFailed: 'Failed to save the cookies' | string;
    deletingCookies: 'Deleting cookies' | string;
    deletingCookiesFailed: 'Failed to delete the cookies' | string;
    alreadyFollowingUser: 'We are already following this user' | string;
    followingUser: (value: string) => `Following user ...` | string;
    buttonStateUnchanged: 'Button did not change state' | string;
    unfollowingUser: (value: string) => `Unfollowing user ...` | string;
    alreadyUnfollowUser: 'User has been unfollowed already' | string;
    unfollowingUserFailed: 'Failed to find unfollow button' | string;
    hasMorePages: (value: string | number) => `Has more pages (current ...)` | string;
    followingUpTo: (value: string | number, username: string) => `Following up to ... followers of ...` | string;
    followingReachedLimit: 'Have reached followed limit for this user, stopping' | string;
    privateUser: `User is private, skipping` | string;
    tooManyFollowerFollowing: (followedByCount: number, followsCount: number) => 'User has too many or too few followers or following, skipping. followedByCount: ... followsCount: ...' | string;
    tooManyFollowerRation: 'User has too many followers compared to follows or opposite, skipping' | string;
    likeImageFailed: (value: string) => `Failed to follow user images ...` | string;
    followingFailed: (value: string) => `Failed to process follower ...` | string;
    unfollowCount: (count: number) => `Unfollowing ... users` | string;
    unfollowBreak: 'Have unfollowed 10 users since last break. Taking a break' | string;
    unfollowCounter: (value: number, total: number) => `Have now unfollowed ... users of total ...` | string;
    unfollowReachLimit: (limit: number) => `Have unfollowed limit of ..., stopping` | string;
    unfollowFailed: 'Failed to unfollow, continuing with next' | string;
    unfollowNonMutual: 'Unfollowing non-mutual followers...' | string;
    unfollowUsers: 'Users to unfollow' | string;
    unfollowOldAutofollow: (days: number) => `Unfollowing currently followed users who were auto-followed more than ... days ago...` | string;
    takingScreenshot: 'Taking screenshot' | string;
    takingScreenshotFailed: 'Failed to take screenshot' | string;
    reachDailyFollowUnfollowLimit: 'Have reached daily follow/unfollow limit, waiting 10 min' | string;
    reachHourlyFollowLimit: 'Have reached hourly follow rate limit, waiting 10 min' | string;
    goToUrl: (url: string) => 'Go to ...' | string;
    userNotFound: 'User not found' | string;
    tooManyRequests: 'Got 429 Too Many Requests, waiting...' | string;
    navigatingToUser: (username: string) => `Navigating to user ...` | string;
    missingGraphql: 'Missing graphql in page, falling back to alternative method...' | string;
    actionBlocked: `Action Blocked` | string;
    actionBlockedAbortion: 'Aborted operation due to action blocked' | string;
    likeImageCount: (count: number | string) => `Liking ... image(s)` | string;
    noImageToLike: 'No images to like' | string;
    likeImageDone: 'Done liking images' | string;
    waiting: 'Waiting' | string;
}

export interface Language {
    fr: Messages;
    en: Messages;
}

export const LanguageMessages: Language = {
	en: {
		actionBlocked: 'Action Blocked',
		actionBlockedAbortion: 'Aborted operation due to action blocked',
		alreadyFollowingUser: 'We are already following this user',
		alreadyUnfollowUser: 'User has been unfollowed already',
		buttonStateUnchanged: 'Button did not change state',
		dbNoFollowedDatabase: 'No followed database found',
		dbNoLikesDatabase: 'No likes database found',
		dbNoUnfollowedDatabase: 'No unfollowed database found',
		dbSaveFailed: 'Failed to save database',
		deletingCookies: 'Deleting cookies',
		deletingCookiesFailed: 'Failed to delete the cookies',
		followingFailed: (value: string) => {
			return `Failed to process follower ${value}`;
		},
		followingReachedLimit: 'Have reached followed limit for this user, stopping',
		followingUpTo: (value: string | number, username: string) => {
			return `Following up to ${value} followers of ${username}`;
		},
		followingUser: (value: string) => {
			return `Following user ${value}`;
		},
		goToUrl: (url: string) => {
			return `Go to ${url}`;
		},
		hasMorePages: (value: string | number) => {
			return `Has more pages (current: ${value})`;
		},
		haveFollowedInTheLastDay: (value: string | number) => {
			return `Have followed/unfollowed ${value} in the last 24 hours`;
		},
		haveFollowedInTheLastHour: (value: string | number) => {
			return `Have followed/unfollowed ${value} in the last hour`;
		},
		haveLikedImagesInTheLastDay: (value: string | number) => {
			return `Have liked ${value} images in the last 24 hours`;
		},
		likeImageCount: (count: number | string) => {
			return `Liking ${count} image(s)`;
		},
		likeImageDone: 'Done liking images',
		likeImageFailed: (value: string) => {
			return `Failed to like user images ${value}`;
		},
		logginPageButtonNotFound: 'Login page button not found, assuming we have login form',
		loginFailed: 'WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.',
		missingGraphql: 'Missing graphql in page, falling back to alternative method...',
		navigatingToUser: (username: string) => {
			return `Navigating to user ${username}`;
		},
		noCookiesFound: 'No cookies found',
		noImageToLike: 'No images to like',
		privateUser: 'User is private, skipping',
		reachDailyFollowUnfollowLimit: 'Have reached daily follow/unfollow limit, waiting 10 min',
		reachHourlyFollowLimit: 'Have reached hourly follow rate limit, waiting 10 min',
		savingCookies: 'Saving cookies',
		savingCookiesFailed: 'Failes to save the cookies',
		settingInstagramLanguage: 'Setting language to english',
		stillNotLoggedIn: 'Still not logged in, trying to reload loading page',
		takingScreenshot: 'Taking screenshot',
		takingScreenshotFailed: 'Failed to take screenshot',
		tooManyFollowerFollowing: (followedByCount: number, followsCount: number) => {
			return `User has too many or too few followers or following, skipping. followedByCount: ${followedByCount}, followsCount: ${followsCount}`;
		},
		tooManyFollowerRation: 'User has too many followers compared to follows or opposite, skipping',
		tooManyRequests: 'Got 429 Too Many Requests, waiting...',
		unfollowBreak: 'Have unfollowed 10 users since last break. Taking a break',
		unfollowCount: (count: number) => {
			return `Unfollowing ${count} users`
		},
		unfollowCounter: (value: number, total: number) => {
			return `Have now unfollowed ${value} users of total ${total}`;
		},
		unfollowFailed: 'Failed to unfollow, continuing with next',
		unfollowNonMutual: 'Unfollowing non-mutual followers...',
		unfollowOldAutofollow: (days: number) => {
			return `Unfollowing currently followed users who were auto-followed more than ${days} days ago...`
		},
		unfollowReachLimit: (limit: number) => {
			return `Have unfollowed limit of ${limit}, stopping`;
		},
		unfollowUsers: 'Users to unfollow',
		unfollowingUser: (value: string) => {
			return `Unfollowing user ${value}`;
		},
		unfollowingUserFailed: 'Failed to find unfollow button',
		userNotFound: 'User not found',
		usernameDetectionFailed: 'Failed to detect username',
		waiting: 'Waiting'
	},
	fr: {
		actionBlocked: 'Action bloqu??e',
		actionBlockedAbortion: "Abortion de l\'op??ration car l\'action a ??t?? bloqu??e",
		alreadyFollowingUser: 'D??ja abonn?? ?? cet utilisateur',
		alreadyUnfollowUser: "D??j?? d??sabonn?? de l\'utilisateur",
		buttonStateUnchanged: 'L\'??tat du button n\'a pas chang??',
		dbNoFollowedDatabase: 'Pas de base de donn??e trouv?? pour enregistrer les abonnements',
		dbNoLikesDatabase: "Pas de base de donn??e trouv?? pour enregistrer les mention \"j'aime\"",
		dbNoUnfollowedDatabase: 'Pas de base de donn??e trouv?? pour enregistrer les d??sabonnements',
		dbSaveFailed: 'Enregistrement des donn??es ??chou??',
		deletingCookies: 'Suppression des cookies',
		deletingCookiesFailed: '??chec de la suppression des cookies',
		followingFailed: (value: string) => {
			return `??chec de l'abonnement ?? l'utilisateur ${value}`;
		},
		followingReachedLimit: "Limite d\'abonnement atteinte pour cet utilisateur, arr??t",
		followingUpTo: (value: string | number, username: string) => {
			return `Aller jusqu\'?? ${value} abonnement aux utilisateurs de l\'utilisateur ${username}`;
		},
		followingUser: (value: string) => {
			return `Abonnement ?? l\'utilisateur ${value}`;
		},
		goToUrl: (url: string) => {
			return `Navigation vers ${url}`;
		},
		hasMorePages: (value: string | number) => {
			return `Il y a encore des pages (page actuelle: ${value})`;
		},
		haveFollowedInTheLastDay: (value: string | number) => {
			return `il y a eu ${value} (d??s)abonnements dans les derni??re 24 heures`;
		},
		haveFollowedInTheLastHour: (value: string | number) => {
			return `il y a eu ${value} (d??s)abonnements dans la derni??re heure`;
		},
		haveLikedImagesInTheLastDay: (value: string | number) => {
			return `Il y a ey ${value} images aim??s dans les derni??res 24 heures`;
		},
		likeImageCount: (count: number | string) => {
			return `Mention "J'aime" ${count} image(s)`;
		},
		likeImageDone: 'Mention \"J\'aime\" sur les images termin??',
		likeImageFailed: (value: string) => {
			return `Mention "j'aime" sur les images de l'utilisateur ${value} ??chou??`;
		},
		logginPageButtonNotFound: 'Page de connexion non trouv??, continuer comme si la connexion est ??tablie',
		loginFailed: 'ATTENTION: Connexion ??chou??e. Cela peut ??tre d?? ?? un nom d\'utilisateur ou un mot de passe incorrect. Cela peut aussi ??tre d?? ?? une connexion suspicieuse. Vous devez manuellement compl??ter ce processus.',
		missingGraphql: 'Graphql manquant sur la page, utilisation de la m??thode alternative...',
		navigatingToUser: (username: string) => {
			return `Navigation vers ${username}`;
		},
		noCookiesFound: 'Aucun cookie n\'a ??t?? trouv??',
		noImageToLike: 'Pas d\'image permettant la mention "j\'aime"',
		privateUser: "Le compte de l\'utilisateur est priv??, passer",
		reachDailyFollowUnfollowLimit: 'Limite (d??s)abonnement atteinte, patienter 10 min',
		reachHourlyFollowLimit: 'Limite d\'abonnement par heure atteinte, patienter 10 min',
		savingCookies: 'Enregistrement des cookies',
		savingCookiesFailed: '??chec de l\'enregistrement des cookies',
		settingInstagramLanguage: 'R??glage de la langue sur anglais',
		stillNotLoggedIn: 'Toujours pas connect??, nous allons essayer de rafraichir la page',
		takingScreenshot: 'Capture d\'??cran',
		takingScreenshotFailed: '??chec de la capture d\'??cran',
		tooManyFollowerFollowing: (followedByCount: number, followsCount: number) => {
			return `L'utilisateur a trop d'abonn??s ou d'abonnement, passer. Abonn??s: ${followedByCount}, Abonnements: ${followsCount}`
		},
		tooManyFollowerRation: "l'utilisateur a trop d'abonn??s compar?? aux abonnements ou vice versa, passer",
		tooManyRequests: 'Erreur 429 trop de requ??tes, patienter...',
		unfollowBreak: '10 d??sabonnements r??alis??s depuis la derni??re pause. Pause',
		unfollowCount: (count: number) => {
			return `D??sabonnements de ${count} users`
		},
		unfollowCounter: (value: number, total: number) => {
			return `D??sabonnements de ${value} utilisateurs sur ${total}`;
		},
		unfollowFailed: "D??sabonnement ??chou??, d??sabonnement de l'utilisateur suivant",
		unfollowNonMutual: 'D??sabonnement des utilisateurs non mutuel...',
		unfollowOldAutofollow: (days: number) => {
			return `D??sabonnement des utilisateurs pour lesquels un abonnement automatique a ??t?? r??alis?? il y a plus de ${days} jours...`
		},
		unfollowReachLimit: (limit: number) => {
			return `limit de d??sabonnement atteinte ${limit}, arr??t`;
		},
		unfollowUsers: 'Se d??sabonner des utilisateurs suivants ',
		unfollowingUser: (value: string) => {
			return `D??sabonnement ?? l\'utilisateur ${value}`;
		},
		unfollowingUserFailed: "??chec de d??sabonnement ?? l\'utilisateur",
		userNotFound: 'Utilisateur non trouv??',
		usernameDetectionFailed: '??chec de la detection du nom d\'utilisateur',
		waiting: 'Patienter'
	}
}