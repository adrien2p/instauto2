export interface Messages {
    settingInstagramLanguage: 'Setting language to english' | string;
    logginPageButtonNotFound: 'Login page button not found, assuming we have login form' | string;
    stillNotLoggedIn: 'Still not logged in, trying to reload loading page' | string;
    loginFailed: 'WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.' | string;
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
        loginFailed: 'ATTENTION: Connexion échouée. Cela peut être dû à un nom d\'utilisateur ou un mot de passe incorrect. Cela peut aussi être dû à une connexion suspicieuse. Vous devez manuellement compléter ce processus.'
    },
    en: {
        settingInstagramLanguage: 'Setting language to english',
        logginPageButtonNotFound: 'Login page button not found, assuming we have login form',
        stillNotLoggedIn: 'Still not logged in, trying to reload loading page',
        loginFailed: 'WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.'
    }
}