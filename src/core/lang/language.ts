export interface Messages {
    settingInstagramLanguage: 'Setting language to english' | string;
}

export interface Language {
    fr: Messages;
    en: Messages;
}

export const LanguageMessages: Language = {
    fr: {
        settingInstagramLanguage: 'Réglage de la langue sur anglais'
    },
    en: {
        settingInstagramLanguage: 'Setting language to english'
    }
}