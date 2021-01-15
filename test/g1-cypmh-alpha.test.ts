import { Server } from 'http';
import TestBrowser from './test-browser';

let server: Server;
let browser: TestBrowser;

beforeAll(async () => {
    server = require("../app").server
    browser = await TestBrowser.launch()
});

afterAll(async () => {
    await browser.close()
    server.close()
});

beforeEach(async () => await browser.goto('localhost:2000')
);

describe('user does some thing journey to get to ta page', () => {
    it('should follow links and navigate to expected urls', async () => {
        await browser.clickLink('New user discovering the service (no authorisation)')
        expect(browser.url().pathname).toBe('another/url')
    })
})
