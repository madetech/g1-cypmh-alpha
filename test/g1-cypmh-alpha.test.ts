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
}

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

    it('links text service... to results 2', async () => {
        await browser.goto('localhost:2000/mental-health-check-in/results')
        await browser.clickLink('text service')
        expect(browser.url().pathname).toBe('/mental-health-check-in/results-2')
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

describe('self referral page', () => {
    it('links submit button to referral received', async () => {
        await browser.goto('localhost:2000/self-referral')
        await browser.clickLink('Submit')
        expect(browser.url().pathname).toBe('/referral-received')
    })
})

describe('referral received page', () => {
    it('links 3 weeks later button to dashboard 1', async () => {
        await browser.goto('localhost:2000/referral-received');
        await browser.clickElement('three-weeks-later-button');
        expect(browser.url().pathname).toBe('/dashboard');
    })
})

describe('dashboard', () => {
    it('links opt in to check-in service to text check-ins', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('opt in to the text check-in service');
        expect(browser.url().pathname).toBe('/text-check-ins');
    })
    it('links learn more to read about your treatment', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('This page');
        expect(browser.url().pathname).toBe('/read-about-your-treatment');
    })
    it('links share their.. to stories from others', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('share their stories and answer common questions');
        expect(browser.url().pathname).toBe('/stories-from-others');
    })
    it('links join a private.. to stories from others', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('join a private online forum');
        expect(browser.url().pathname).toBe('/stories-from-others');
    })
    it('links tic+.. to tic website', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('tic+');
        expect(browser.url().href).toBe('https://www.ticplus.org.uk/');
    })
    it('links kooth.. to kooth website', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('Kooth');
        expect(browser.url().href).toBe('https://www.kooth.com/');
    })
    it('links Update your free times.. to your schedule', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('Update your free times');
        expect(browser.url().pathname).toBe('/your-schedule');
    })
    xit('links let us know .. ???', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickLink('Let us know');
        expect(browser.url().pathname).toBe('???');
    })
    it('links eight weeks .. dashboard 2', async () => {
        await browser.goto('localhost:2000/dashboard');
        await browser.clickElement('eight-weeks-later-button');
        expect(browser.url().pathname).toBe('/dashboard-2');
    })
})

describe('dashboard-2', () => {
    xit('links change appointment time to ???', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('Change your appointment time or date');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links care plan to ???', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('Care plan 151220.pdf');
        expect(browser.url().pathname).toBe('???');
    })
    it('links appointment with to appointment summary', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('Appointment with Dr. Matthew Marsh.');
        expect(browser.url().pathname).toBe('/appointment-summary');
    })
    xit('links appointment with 9/11/20 to ???', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('Appointment with Dr. Matthew Marsh.');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links appointment with 9/10/20 to ???', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('9th October 2020');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links appointment with 9/9/20 to ???', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('9th September 2020');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links appointment with 9/8/20 to ???', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('9th August 2020');
        expect(browser.url().pathname).toBe('???');
    })
    it('links update your free times to your schedule', async () => {
        await browser.goto('localhost:2000/dashboard-2');
        await browser.clickLink('Update your free times');
        expect(browser.url().pathname).toBe('/your-schedule');
    })
})

describe('appointment summary', () => {
    xit('links on the NHS website to ???', async () => {
        await browser.goto('localhost:2000/appointment summary');
        await browser.clickLink('on the NHS website');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links appointment with 9/11/20 to ???', async () => {
        await browser.goto('localhost:2000/appointment-summary');
        await browser.clickLink('Appointment with Dr. Matthew Marsh.');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links appointment with 9/10/20 to ???', async () => {
        await browser.goto('localhost:2000/appointment-summary');
        await browser.clickLink('9th October 2020');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links appointment with 9/9/20 to ???', async () => {
        await browser.goto('localhost:2000/appointment-summary');
        await browser.clickLink('9th September 2020');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links appointment with 9/8/20 to ???', async () => {
        await browser.goto('localhost:2000/appointment-summary');
        await browser.clickLink('9th August 2020');
        expect(browser.url().pathname).toBe('???');
    })
    it('links update your free times to your schedule', async () => {
        await browser.goto('localhost:2000/appointment-summary');
        await browser.clickLink('Update your free times');
        expect(browser.url().pathname).toBe('/your-schedule');
    })
})

describe('learn about treatment', () => {
    xit('links Cognitive behavioural... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Cognitive Behavioural Therapy (CBT)');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links Family therapy... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Family therapy');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links Behavioural interventions... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Behavioural interventions');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links Psychotherapy... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Psychotherapy');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links Creative therapies... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Creative therapies');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links Group therapy and psycho-educational groups... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Group therapy and psycho-educational groups');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links Medication... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Medication');
        expect(browser.url().pathname).toBe('???');
    })
    xit('links Parent support groups... to ???', async () => {
        await browser.goto('localhost:2000/read-about-your-treatment');
        await browser.clickElement('Parent support groups');
        expect(browser.url().pathname).toBe('???');
    })
})