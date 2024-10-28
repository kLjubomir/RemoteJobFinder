const { test, expect } = require('@playwright/test')
const { LinkedinLoginPage } = require('../page_objects/linkedin/LinkedinLoginPage');
const { LinkedinHomePage } = require('../page_objects/linkedin/LinkedinHomePage');
const { LinkedinJobsPage } = require('../page_objects/linkedin/LinkedinJobsPage')
const credentials = require('../test_data/credentials.json')
exports.test = test.extend({
    linkedinLoginPage: async ({ page }, use) => {
        await use(new LinkedinLoginPage(page));
    },

    linkedinHomePage: async ({ page }, use) => {
        await use(new LinkedinHomePage(page));
    },

    linkedinJobsPage: async ({ page }, use) => {
        await use(new LinkedinJobsPage(page));
    },
    credentials: async ({ }, use) => {
        await use(credentials);
    }
});
exports.expect = expect;