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
		actionBlocked: 'Action bloquée',
		actionBlockedAbortion: "Abortion de l\'opération car l\'action a été bloquée",
		alreadyFollowingUser: 'Déja abonné à cet utilisateur',
		alreadyUnfollowUser: "Déjà désabonné de l\'utilisateur",
		buttonStateUnchanged: 'L\'état du button n\'a pas changé',
		dbNoFollowedDatabase: 'Pas de base de donnée trouvé pour enregistrer les abonnements',
		dbNoLikesDatabase: "Pas de base de donnée trouvé pour enregistrer les mention \"j'aime\"",
		dbNoUnfollowedDatabase: 'Pas de base de donnée trouvé pour enregistrer les désabonnements',
		dbSaveFailed: 'Enregistrement des données échoué',
		deletingCookies: 'Suppression des cookies',
		deletingCookiesFailed: 'Échec de la suppression des cookies',
		followingFailed: (value: string) => {
			return `Échec de l'abonnement à l'utilisateur ${value}`;
		},
		followingReachedLimit: "Limite d\'abonnement atteinte pour cet utilisateur, arrêt",
		followingUpTo: (value: string | number, username: string) => {
			return `Aller jusqu\'à ${value} abonnement aux utilisateurs de l\'utilisateur ${username}`;
		},
		followingUser: (value: string) => {
			return `Abonnement à l\'utilisateur ${value}`;
		},
		goToUrl: (url: string) => {
			return `Navigation vers ${url}`;
		},
		hasMorePages: (value: string | number) => {
			return `Il y a encore des pages (page actuelle: ${value})`;
		},
		haveFollowedInTheLastDay: (value: string | number) => {
			return `il y a eu ${value} (dés)abonnements dans les dernière 24 heures`;
		},
		haveFollowedInTheLastHour: (value: string | number) => {
			return `il y a eu ${value} (dés)abonnements dans la dernière heure`;
		},
		haveLikedImagesInTheLastDay: (value: string | number) => {
			return `Il y a ey ${value} images aimés dans les dernières 24 heures`;
		},
		likeImageCount: (count: number | string) => {
			return `Mention "J'aime" ${count} image(s)`;
		},
		likeImageDone: 'Mention \"J\'aime\" sur les images terminé',
		likeImageFailed: (value: string) => {
			return `Mention "j'aime" sur les images de l'utilisateur ${value} échoué`;
		},
		logginPageButtonNotFound: 'Page de connexion non trouvé, continuer comme si la connexion est établie',
		loginFailed: 'ATTENTION: Connexion échouée. Cela peut être dû à un nom d\'utilisateur ou un mot de passe incorrect. Cela peut aussi être dû à une connexion suspicieuse. Vous devez manuellement compléter ce processus.',
		missingGraphql: 'Graphql manquant sur la page, utilisation de la méthode alternative...',
		navigatingToUser: (username: string) => {
			return `Navigation vers ${username}`;
		},
		noCookiesFound: 'Aucun cookie n\'a été trouvé',
		noImageToLike: 'Pas d\'image permettant la mention "j\'aime"',
		privateUser: "Le compte de l\'utilisateur est privé, passer",
		reachDailyFollowUnfollowLimit: 'Limite (dés)abonnement atteinte, patienter 10 min',
		reachHourlyFollowLimit: 'Limite d\'abonnement par heure atteinte, patienter 10 min',
		savingCookies: 'Enregistrement des cookies',
		savingCookiesFailed: 'Échec de l\'enregistrement des cookies',
		settingInstagramLanguage: 'Réglage de la langue sur anglais',
		stillNotLoggedIn: 'Toujours pas connecté, nous allons essayer de rafraichir la page',
		takingScreenshot: 'Capture d\'écran',
		takingScreenshotFailed: 'Échec de la capture d\'écran',
		tooManyFollowerFollowing: (followedByCount: number, followsCount: number) => {
			return `L'utilisateur a trop d'abonnés ou d'abonnement, passer. Abonnés: ${followedByCount}, Abonnements: ${followsCount}`
		},
		tooManyFollowerRation: "l'utilisateur a trop d'abonnés comparé aux abonnements ou vice versa, passer",
		tooManyRequests: 'Erreur 429 trop de requêtes, patienter...',
		unfollowBreak: '10 désabonnements réalisés depuis la dernière pause. Pause',
		unfollowCount: (count: number) => {
			return `Désabonnements de ${count} users`
		},
		unfollowCounter: (value: number, total: number) => {
			return `Désabonnements de ${value} utilisateurs sur ${total}`;
		},
		unfollowFailed: "Désabonnement échoué, désabonnement de l'utilisateur suivant",
		unfollowNonMutual: 'Désabonnement des utilisateurs non mutuel...',
		unfollowOldAutofollow: (days: number) => {
			return `Désabonnement des utilisateurs pour lesquels un abonnement automatique a été réalisé il y a plus de ${days} jours...`
		},
		unfollowReachLimit: (limit: number) => {
			return `limit de désabonnement atteinte ${limit}, arrêt`;
		},
		unfollowUsers: 'Se désabonner des utilisateurs suivants ',
		unfollowingUser: (value: string) => {
			return `Désabonnement à l\'utilisateur ${value}`;
		},
		unfollowingUserFailed: "Échec de désabonnement à l\'utilisateur",
		userNotFound: 'Utilisateur non trouvé',
		usernameDetectionFailed: 'Échec de la detection du nom d\'utilisateur',
		waiting: 'Patienter'
	}
}