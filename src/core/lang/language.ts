export interface Messages {
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
}

export interface Language {
    fr: Messages;
    en: Messages;
}

export const LanguageMessages: Language = {
	fr: {
		settingInstagramLanguage: 'Réglage de la langue sur anglais',
		logginPageButtonNotFound: 'Page de connexion non trouvé, continuer comme si la connexion est établie',
		stillNotLoggedIn: 'Toujours pas connecté, nous allons essayer de rafraichir la page',
		loginFailed: 'ATTENTION: Connexion échouée. Cela peut être dû à un nom d\'utilisateur ou un mot de passe incorrect. Cela peut aussi être dû à une connexion suspicieuse. Vous devez manuellement compléter ce processus.',
		haveFollowedInTheLastDay: (value: string | number) => {
			return `il y a eu ${value} abonnements/désabonnements dans les dernière 24 heures`;
		},
		haveFollowedInTheLastHour: (value: string | number) => {
			return `il y a eu ${value} abonnements/désabonnements dans la dernière heure`;
		},
		haveLikedImagesInTheLastDay: (value: string | number) => {
			return `HIl y a ey ${value} images aimés dans les dernières 24 heures`;
		},
		usernameDetectionFailed: 'Échec de la detection du nom d\'utilisateur',
		noCookiesFound: 'Aucun cookie n\'a été trouvé',
		savingCookies: 'Enregistrement des cookies',
		savingCookiesFailed: 'Échec de l\'enregistrement des cookies',
		deletingCookies: 'Suppression des cookies',
		deletingCookiesFailed: 'Échec de la suppression des cookies',
		alreadyFollowingUser: 'Déja abonné à cet utilisateur',
		followingUser: (value: string) => {
			return `Abonnement à l\'utilisateur ${value}`;
		},
		buttonStateUnchanged: 'L\'état du button n\'a pas changé',
		unfollowingUser: (value: string) => {
			return `Désabonnement à l\'utilisateur ${value}`;
		},
		alreadyUnfollowUser: "Déjà désabonné de l\'utilisateur",
		unfollowingUserFailed: "Échec de désabonnement à l\'utilisateur",
		hasMorePages: (value: string | number) => {
			return `Il y a encore des pages (page actuelle: ${value})`;
		},
		followingUpTo: (value: string | number, username: string) => {
			return `Aller jusqu\'à ${value} abonnement aux utilisateurs de l\'utilisateur ${username}`;
		},
		followingReachedLimit: "Limite d\'abonnement atteinte pour cet utilisateur, arrêt",
		privateUser: "Le compte de l\'utilisateur est privé, passer"
	},
	en: {
		settingInstagramLanguage: 'Setting language to english',
		logginPageButtonNotFound: 'Login page button not found, assuming we have login form',
		stillNotLoggedIn: 'Still not logged in, trying to reload loading page',
		loginFailed: 'WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.',
		haveFollowedInTheLastDay: (value: string | number) => {
			return `Have followed/unfollowed ${value} in the last 24 hours`;
		},
		haveFollowedInTheLastHour: (value: string | number) => {
			return `Have followed/unfollowed ${value} in the last hour`;
		},
		haveLikedImagesInTheLastDay: (value: string | number) => {
			return `Have liked ${value} images in the last 24 hours`;
		},
		usernameDetectionFailed: 'Failed to detect username',
		noCookiesFound: 'No cookies found',
		savingCookies: 'Saving cookies',
		savingCookiesFailed: 'Failes to save the cookies',
		deletingCookies: 'Deleting cookies',
		deletingCookiesFailed: 'Failed to delete the cookies',
		alreadyFollowingUser: 'We are already following this user',
		followingUser: (value: string) => {
			return `Following user ${value}`;
		},
		buttonStateUnchanged: 'Button did not change state',
		unfollowingUser: (value: string) => {
			return `Unfollowing user ${value}`;
		},
		alreadyUnfollowUser: "User has been unfollowed already",
		unfollowingUserFailed: "Failed to find unfollow button",
		hasMorePages: (value: string | number) => {
			return `Has more pages (current: ${value})`;
		},
		followingUpTo: (value: string | number, username: string) => {
			return `Following up to ${value} followers of ${username}`;
		},
		followingReachedLimit: "Have reached followed limit for this user, stopping",
		privateUser: "User is private, skipping"
	}
}