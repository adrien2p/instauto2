import { ElementHandle, Page } from 'puppeteer-core';
import { Logger } from './interfaces';

export class Utils {
	private static _logger: Logger = console;

	static set logger(logger: Logger) {
		this._logger = logger;
	}

	static puppeteerPageOverride(page: Page): Page {
		const originalXPath = page.$x;
		page.$x = async function (expression: string): Promise<ElementHandle[]> {
			const containsSensitiveRegexp = new RegExp(/\[contains\(text\(\), (.*)\)\]/);
			const alphabetLo = 'abcdefghijklmnopqrstuvwxyz';
			const alphabetUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			expression = expression.replace(containsSensitiveRegexp, (match: string, p1: string): string => {
				return `[contains(translate(text(), '${alphabetUp}', '${alphabetLo}'), ${p1.toLowerCase()})]`
			});
			return originalXPath.apply(this, [expression]);
		}
		return page;
	}

	static keyBy<T>(collection: T[], key: string): Record<string, T> {
		const result: Record<string, T> = {};
		collection.reduce((accumulator: Record<string, T>, current: T): Record<string, T> => {
			accumulator[current[key]] = current;
			return accumulator;
		}, result);
		return result;
	}

	static sleep(ms: number, dev = 1): Promise<string> {
		const msWithDev = ((Math.random() * dev) + 1) * ms;
		this._logger.log('Waiting', Math.round(msWithDev / 1000), 'sec');
		return new Promise(resolve => setTimeout(resolve, msWithDev));
	}

	static async filter<T>(arr: T[], predicate: (element: T) => Promise<boolean>): Promise<T[]> {
		const results = await Promise.all(arr.map(predicate));
		return arr.filter((_v, index) => results[index]);
	}
}