import { ElementHandle, Page } from "puppeteer";
import { Follower, UnFollower } from "./interfaces";

export class Utils {
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
}