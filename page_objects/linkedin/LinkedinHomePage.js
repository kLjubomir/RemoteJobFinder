const { expect } = require('@playwright/test')

class LinkedinHomePage {

    constructor(page) {
        this.page = page;
        this.jobsNavItem = this.page.locator('//a[contains(@href, "/jobs/")]');
    }

    async navigateToJobs() {
        await this.jobsNavItem.last().click();
        await expect(this.page).toHaveURL(/\/jobs\//);
    }

}

module.exports = { LinkedinHomePage }