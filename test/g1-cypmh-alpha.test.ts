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

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
};

// beforeEach(async () => await browser.goto('localhost:2000')
// );

describe('Index', () => {
    it('links New user... to landing page', async () => {
        await browser.goto('localhost:2000')
        await browser.clickLink('New user discovering the service')
        expect(browser.url().pathname).toBe('/landing-page')
    })

    it('links triaged user... to first dashboard page', async () => {
        await browser.goto('localhost:2000')
        await browser.clickLink('User has been triaged')
        expect(browser.url().pathname).toBe('/dashboard')
    })

    it('links appointments in progress... to second dashboard page', async () => {
        await browser.goto('localhost:2000')
        await browser.clickLink('Appointments in progress')
        expect(browser.url().pathname).toBe('/dashboard-2')
    })
})

describe('Landing page', () => {
    xit('links NHS partner services... to ?', async () => {
        await browser.goto('localhost:2000/landing-page')
        await browser.clickLink('NHS partner services')
        expect(browser.url().pathname).toBe('/landing-page')
    })

    xit('links learn more... to ?', async () => {
        await browser.goto('localhost:2000/landing-page')
        await browser.clickLink('Learn more')
        expect(browser.url().pathname).toBe('/landing-page')
    })

    it('links mental health check ... to mental-health-check-in/questions', async () => {
        await browser.goto('localhost:2000/landing-page')
        await browser.clickLink('Mental health check')
        expect(browser.url().pathname).toBe('/mental-health-check-in/questions')
    })

    it('links speak to someone ... to mental-health-check-in/questions', async () => {
        await browser.goto('localhost:2000/landing-page')
        await browser.clickLink('Speak to someone')
        expect(browser.url().pathname).toBe('/mental-health-check-in/questions')
    })
})