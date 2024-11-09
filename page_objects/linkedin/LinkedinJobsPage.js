const { expect } = require('@playwright/test')
const fs = require('fs');
const keyword = process.env.KEYWORD_INCLUDED;
const notRemoteList = process.env.NOT_REMOTE.split(',');
const envTitle = process.env.JOB_TITLE;
const location = process.env.LOCATION;
class LinkedinJobsPage {

    constructor(page) {
        this.page = page;
        this.jobTitle = this.page.locator("//input[contains(@id, 'jobs-search-box-keyword-id-')]");
        this.jobLocation = this.page.locator("//input[contains(@id, 'jobs-search-box-location-id-')]");
        this.workplaceType = this.page.locator('#searchFilter_workplaceType');
        this.workplaceTypeRemote = this.page.locator('//li[@class="search-reusables__collection-values-item"]/input[@id="workplaceType-2"]');
        this.applyCurrentlyVisibleFilter = this.page.locator("button[aria-label*='Apply current filter to show']:visible");
        this.typeAhead = this.page.locator('//div[contains(@class, "jobs-search-box__typeahead-suggestion")]');
        this.maxResultsCount = this.page.locator('//div[contains(@class,"jobs-search-results-list")]/span[@dir="ltr"]');
        this.adsOnCurrentPage = this.page.locator('//li[contains(@class, "jobs-search-results__list-item")]');
        this.adDescription = this.page.locator('#job-details');
        this.loaderAnimation = this.page.locator('.artdeco-loader__bars');
        this.keyword = keyword;
        this.notRemoteList = notRemoteList;
        this.title = envTitle;
        this.location = location;
    }

    async checkLoadersHidden() {
        const loaderCount = await this.loaderAnimation.count();

        for (let i = 0; i < loaderCount; i++) {
            await expect(this.loaderAnimation.nth(i)).toBeHidden();
        };
    };

    /**
     * Uses the linkedin UI to search for a job using .env parameters:
     * @param {*} title 
     * @param {*} location 
     */
    async searchForJobs(title = this.title, location = this.location) {
        await this.jobTitle.fill(title);
        await this.jobLocation.fill(location);
        await this.typeAhead.first().click();
    }

    async applyRemote() {
        await this.workplaceType.click();
        await this.workplaceTypeRemote.click({ force: true });
        await this.applyCurrentlyVisibleFilter.click();
        await expect(this.applyCurrentlyVisibleFilter).not.toBeVisible();
        await this.checkLoadersHidden();
    }

    async getResultsCount() {
        let maxResultText = await this.maxResultsCount.textContent();
        let maxResultNumber;

        if (maxResultText.includes(',')) {
            maxResultNumber = parseInt(maxResultText.replace(',', ''));
        } else {
            maxResultNumber = parseInt(maxResultText);
        }

        if (maxResultNumber > 1000) {
            maxResultNumber = 1000;
        } else if (!maxResultNumber) {
            throw new Error('The search result number is falsy: 0, null, undefined, NaN or false, expected a number greater than 0');
        }
        console.log('The search yielded ' + maxResultNumber + ' results')
        return maxResultNumber;
    }

    async getAdsOnCurrentPage() {
        return await this.adsOnCurrentPage.count();
    }

    async openAd(number) {
        await this.adsOnCurrentPage.nth(number).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getLinkedinAdDesc() {
        await expect(this.adDescription).toBeVisible();
        return await this.adDescription.textContent();
    }
    /**
     * Navigates to a page in the job search. First manually navigates to page 2 and then uses URL query params to navigate
     * @param {*} number page number
     */
    async navigateToPage(number) {
        if (number === 2) {
            const paginationLocator = this.page.locator(`li[data-test-pagination-page-btn="${number}"]`);
            await expect(paginationLocator).not.toHaveAttribute('aria-current', 'true');
            await paginationLocator.click();
        } else {
            const currentPage = await this.page.url().includes('refresh=true') ? await this.page.url().replace('refresh=true', 'refresh=false') : await this.page.url();
            const newStartValue = (number - 1) * 25;
            const nextPage = currentPage.replace(/(start=)\d+/, `$1${newStartValue}`)
            await this.page.goto(nextPage)
        }
        //if linkedin ever fixes their performance with pagination this is the manual navigation part
        // if (number % 3 == 0 && number > 8) {
        //     await this.page.locator('//li/button/span/..').nth(8).click();
        // } else {
        //     const paginationLocator = this.page.locator(`li[data-test-pagination-page-btn="${number}"]`);
        //     await expect(paginationLocator).not.toHaveAttribute('aria-current', 'true');
        //     await paginationLocator.click();
        // }
        await this.page.waitForLoadState('domcontentloaded');
        await this.checkLoadersHidden();
    }

    async adIncludes(text, keyword = this.keyword) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes(keyword.toLowerCase())) {
            console.log('Ad includes Playwright ' + this.page.url())
            return true;
        }
    }

    async trueRemote(text, notRemoteList = this.notRemoteList) {
        let isRemote = true;
        const lowerText = text.toLowerCase();
        for (const notRemote of notRemoteList) {
            if (lowerText.includes(notRemote)) {
                isRemote = false;
            }
        }
        return isRemote;
    }


    async dynamicallyFilterAds(text, title = this.title, location = this.location) {
        const isRemote = await this.trueRemote(text)
        const adIncludes = await this.adIncludes(text)
        if (isRemote == true && adIncludes == true) {
            try {
                fs.appendFile(`results-${title}-${location}.txt`, this.page.url() + "\n", (err) => {
                    if (err) {
                        console.error('Error appending to file:', err);
                    }
                });
            } catch (err) {
                console.error('Unexpected error:', err);
            }
        }
    }

}

module.exports = { LinkedinJobsPage }