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

describe('mental health check questions page', () => {
    it('links Next page ... to mental-health-check-in/questions-2', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/questions')
        await browser.clickElement('next_your_feelings')
        expect(browser.url().pathname).toBe('/mental-health-check-in/questions-2')
    })
})

describe('mental health check questions 2 page', () => {
    it('links Next page ... to results1', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/questions-2')
        await browser.clickElement('next_your_results')
        expect(browser.url().pathname).toBe('/mental-health-check-in/results')
    })
    it('links Previous ... to mental-health-check-in/questions', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/questions-2')
        await browser.clickElement('previous_about_you')
        expect(browser.url().pathname).toBe('/mental-health-check-in/questions')
    })
})

describe('Find support - results (page 1)', () => {
    it('links Free online cog... to getselfhelp.co.uk', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results')
        await browser.clickLink('Free online cognitive behavioural therapy (CBT) course')
        expect(browser.url().href).toBe('https://www.getselfhelp.co.uk/')
    })
    xit('links proven to help with... to ??', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results')
        await browser.clickLink('proven to help with mental health problems')
        expect(browser.url().pathname).toBe('???')
    })
    it('links Gloucester self... to gloucestershireselfharm.co.uk', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results')
        await browser.clickLink('Gloucestershire self-harm helpline')
        expect(browser.url().href).toBe('https://www.gloucestershireselfharm.org/')
    })
    it('links tic+... to tic+.co.uk', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results')
        await browser.clickLink('tic+ - free counselling and helpline')
        expect(browser.url().href).toBe('https://www.ticplus.org.uk/')
    })
    it('links Free online counci... to kooth.com', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results')
        await browser.clickLink('Free online counselling and support network')
        expect(browser.url().href).toBe('https://www.kooth.com/')
    })
    
})

describe('Find support - results (page 2)', () => {
    it('links Gloucest... to self-referral', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results-2')
        await browser.clickLink('Gloucestershire specialist mental health services')
        expect(browser.url().pathname).toBe('/self-referral')
    })
    it('links Gloucester self... to gloucestershireselfharm.co.uk', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results-2')
        await browser.clickLink('Gloucestershire self-harm helpline')
        expect(browser.url().href).toBe('https://www.gloucestershireselfharm.org/')
    })
})
