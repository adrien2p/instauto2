import { LanguageMessages, Messages } from './language';

class LanguageManager {
	private _languageMessages = LanguageMessages.en;

	get messages(): Messages {
    	return this._languageMessages;
	}

	useExistingCustomLanguage(key: 'fr' | 'en'): void {
		this._languageMessages = LanguageManager[key];
	}

	setCustomLanguage(LanguageMessages: Messages): void {
		this._languageMessages = LanguageMessages;
	}

	resetLanguage(): void {
		this._languageMessages = LanguageMessages.en;
	}
}

export const languageManager = new LanguageManager();
