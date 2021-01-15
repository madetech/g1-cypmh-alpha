import { launch as pLaunch, Browser, Page } from 'puppeteer'

export default class TestBrowser {
    static launch = async () => {
        let browser = await pLaunch({ headless: false, args: ['--window-size=1200,800'] });
        const page = await browser.newPage();
        return new TestBrowser(browser, page);

    }
    constructor(private readonly puppeteerBrowser: Browser, private readonly page: Page) { }

    async goto(url: string) {
        await this.page.goto('localhost:2000', { waitUntil: 'networkidle2' });
    }

    async close() {
        await this.puppeteerBrowser.close();
    }

    url(): URL {
        return new URL(this.page.url())
    }

    async clickLink(linkText: string) {
        linkText = unescape(linkText)
        let links = await this.page.$x(`//a[contains(text(), '${linkText}')]`);
        await links[0].click();
        await this.page.waitForNavigation();
    }
}