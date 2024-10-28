// @ts-check
const { test, expect } = require('../fixtures/PageObjectFixture');
const { Utils } = require('../utils/utils');
//use credentials in playwright config in the use portion

test('Search for a job using filters on linkedin', async ({ credentials, linkedinLoginPage, linkedinHomePage, linkedinJobsPage }) => {
  const username = credentials.username;
  const password = credentials.password;
  await linkedinLoginPage.visitLoginPage();
  await linkedinLoginPage.acceptCookies();
  await linkedinLoginPage.login(username, password);
  await linkedinHomePage.navigateToJobs();
  await linkedinJobsPage.searchForJobs('Quality Assurance Engineer', 'Worldwide');
  await linkedinJobsPage.applyRemote();

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
      pageIterator++;
      await linkedinJobsPage.navigateToPage(pageIterator);
    }
  }
});
