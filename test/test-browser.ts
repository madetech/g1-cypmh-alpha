import { launch as pLaunch, Browser, Page } from 'puppeteer'

export default class TestBrowser {
    static launch = async () => {
        let browser = await pLaunch({ headless: false, args: ['--window-size=1200,800'] });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        return new TestBrowser(browser, page);

    }
    constructor(private readonly puppeteerBrowser: Browser, private readonly page: Page) { 
        page.on('requestfailed', (req, resp) => {
            let failureText = req.failure().errorText;
            if (failureText == 'net::ERR_ABORTED') {
                console.log(resp, req.response())
            }
        });
    }

    
    async goto(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle2' });
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

    async clickElement(linkID: string) {
        linkID = unescape(linkID)
        let links = await this.page.$x(`//*[@id='${linkID}']`);
        await links[0].click();
        await this.page.waitForNavigation();
    }
}