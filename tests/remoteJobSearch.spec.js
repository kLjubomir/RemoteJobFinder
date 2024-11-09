// @ts-check
const { test, expect } = require('../fixtures/PageObjectFixture');
const { Utils } = require('../utils/utils');

test('Search for a job using filters on linkedin', async ({ credentials, linkedinLoginPage, linkedinHomePage, linkedinJobsPage }) => {
  const username = credentials.username;
  const password = credentials.password;
  await linkedinLoginPage.visitLoginPage();
  await linkedinLoginPage.acceptCookies();
  await linkedinLoginPage.login(username, password);
  await linkedinHomePage.navigateToJobs();
  await linkedinJobsPage.searchForJobs();
  await linkedinJobsPage.applyRemote();

  let timeOnPageStart = performance.now();
  let timeOnPageEnd;
  let timeSpentOnPage;
  let totalTimeElapsed = 0;

  const results = await linkedinJobsPage.getResultsCount();
  let totalAdsChecked = 0;
  let adsOnCurrentPage;
  let pageIterator = 1;

  while (totalAdsChecked < results) {
    adsOnCurrentPage = await linkedinJobsPage.getAdsOnCurrentPage();
    for (let adIterator = 0; adIterator < adsOnCurrentPage; adIterator++) {
      await linkedinJobsPage.openAd(adIterator);
      const textInAd = await linkedinJobsPage.getLinkedinAdDesc();
      const isAdEnglish = await Utils.isAdEnglish(textInAd);
      if (isAdEnglish) {
        await linkedinJobsPage.dynamicallyFilterAds(textInAd);
      }
      totalAdsChecked++;
    }
    if (totalAdsChecked < results) {

      timeOnPageEnd = performance.now();
      timeSpentOnPage = (timeOnPageEnd - timeOnPageStart) / 1000
      totalTimeElapsed += timeSpentOnPage;
      console.log('Time in seconds spent on page: ' + timeSpentOnPage.toFixed(2))
      let timePerPage = totalTimeElapsed / pageIterator;
      console.log(`Total time elapsed: ${totalTimeElapsed.toFixed(2)} checking ${pageIterator} page(s) which averages to ${timePerPage.toFixed(2)} seconds per page`)

      pageIterator++;

      await linkedinJobsPage.navigateToPage(pageIterator);
      timeOnPageStart = performance.now();
    }
  }


});

test.skip('aggregate results', async ({ }) => {
  //TODO: Aggregate results, if link within multiple files, remove shared lines or create a set and create a new file with the aggregate
})