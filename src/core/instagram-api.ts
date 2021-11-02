import { Browser, ElementHandle, Page } from "puppeteer";
import { Utils } from "./utils";
import { Logger } from "./interfaces";

const ActionBlocked = Symbol('ActionBlocked');
const TryAgainLater = Symbol('TryAgainLater');
const Follow = Symbol('Follow');
const FollowBack = Symbol('FollowBack');
const Following = Symbol('Following');
const Requested = Symbol('Requested');
const AriaLabelFollowing = Symbol('AriaLabelFollowing');
const Unfollow = Symbol('Unfollow');
const IsLoggedIn = Symbol('IsLoggedIn');
const AcceptCookies = Symbol('AcceptCookies');
const LogInMobile = Symbol('LogInMobile');
const LogIn = Symbol('LogIn');
const SaveLoginInfo = Symbol('SaveLoginInfo');
const NotificationDialogNotNow = Symbol('NotificationDialogNotNow');
const AuthSwitcher = Symbol('AuthSwitcher');

const pageContent = new Map<symbol, string>([
	[ActionBlocked, '//*[contains(text(), "Action Blocked")]'],
	[TryAgainLater, '//*[contains(text(), "Try Again Later")]'],
	[Follow, "//header//button[text()='Follow']"],
	[FollowBack, "//header//button[text()='Follow Back']"],
	[Following, "//header//button[text()='Following']"],
	[Requested, "//header//button[text()='Requested']"],
	[AriaLabelFollowing, "//header//button[*//span[@aria-label='Following']]"],
	[Unfollow, "//button[text()='Unfollow']"],
	[IsLoggedIn, '//*[@aria-label="Home"]'],
	[AcceptCookies, '//button[contains(text(), "Accept")]'],
	[LogIn, "//button[.//text() = 'Log In']"],
	[LogInMobile, '//button[contains(text(), "Log In")]'],
	[SaveLoginInfo, '//button[contains(text(), "Save Info")]'],
	[NotificationDialogNotNow, '//button[contains(text(), "Not Now")]'],
	[AuthSwitcher, 'a[href="/accounts/login/?source=auth_switcher"]']
]);

export class InstagramApi {
	private page: Page;

	constructor(private readonly browser: Browser, private readonly logger: Logger) {
		Utils.logger = logger;
	}

	async startNewPage(): Promise<Page> {
		const page = await this.browser.newPage();
		this.page = Utils.puppeteerPageOverride(page);
		return this.page;
	}

	async isActionBlocked(): Promise<boolean> {
		if (!this.page) {
			throw new Error('Page is not set yet.');
		}

		const actionBlocked = (await this.page.$x(pageContent.get(ActionBlocked))).length > 0;
		const tryAgainLater = (await this.page.$x(pageContent.get(TryAgainLater))).length > 0;

		return actionBlocked || tryAgainLater;
	}

	async getFollowButton(): Promise<ElementHandle> {
		const elementHandles = await this.page.$x(pageContent.get(Follow));
		if (elementHandles.length > 0) return elementHandles[0];

		const elementHandles2 = await this.page.$x(pageContent.get(FollowBack));
		if (elementHandles2.length > 0) return elementHandles2[0];
	}

	async getUnfollowButton(): Promise<ElementHandle> {
		const elementHandles = await this.page.$x(pageContent.get(Following));
		if (elementHandles.length > 0) return elementHandles[0];

		const elementHandles2 = await this.page.$x(pageContent.get(Requested));
		if (elementHandles2.length > 0) return elementHandles2[0];

		const elementHandles3 = await this.page.$x(pageContent.get(AriaLabelFollowing));
		if (elementHandles3.length > 0) return elementHandles3[0];

		return undefined;
	}

	async getUnfollowConfirmButton(): Promise<ElementHandle> {
		const elementHandles = await this.page.$x(pageContent.get(Unfollow));
		return elementHandles[0];
	}

	async isLoggedIn(): Promise<boolean> {
		return (await this.page.$x(pageContent.get(IsLoggedIn))).length === 1;
	}

	async tryPressAcceptCookies(): Promise<void> {
		const element = await this.page.$x(pageContent.get(AcceptCookies));
		return this.tryPressButton(element, 'Accept cookies dialog');
	}

	async tryPressSaveLogInInfo(): Promise<void> {
		const element = await this.page.$x(pageContent.get(SaveLoginInfo));
		return this.tryPressButton(element, 'Save login info dialog');
	}

	async tryPressNotNowNotificationDialog(): Promise<void> {
		const element = await this.page.$x(pageContent.get(NotificationDialogNotNow));
		return this.tryPressButton(element, 'Turn on Notifications dialog');
	}

	async tryPressAuthSwitcher(): Promise<void> {
		const element = await this.page.$x(pageContent.get(AuthSwitcher));
		return this.tryPressButton(element, 'Try to press auth switcher');
	}

	async tryToLogin(username: string, password: string): Promise<void> {
		await this.page.type('input[name="username"]', username, { delay: 50 });
		await Utils.sleep(1000);

		await this.page.type('input[name="password"]', password, { delay: 50 });
		await Utils.sleep(1000);

		await this.tryPressLogIn();
		await Utils.sleep(6000);

	}

	private async tryPressLogIn(): Promise<void> {
		const element = await this.page.$x(pageContent.get(LogIn));
		await this.tryPressButton(element, 'Login form button');
		const element2 = await this.page.$x(pageContent.get(LogInMobile));
		await this.tryPressButton(element2, 'Login form button');
	}

	private async tryPressButton(elementHandles: ElementHandle[], name: string): Promise<void> {
		try {
			if (elementHandles.length === 1) {
				this.logger.log(`Pressing button: ${name}`);
				elementHandles[0].click();
				await Utils.sleep(3000);

			}
		} catch (err) {
			this.logger.warn(`Failed to press button: ${name}`);
		}
	}
}