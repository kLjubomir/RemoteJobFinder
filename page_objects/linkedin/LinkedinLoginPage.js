class LinkedinLoginPage {
    constructor(page) {
        this.page = page;
        this.cookieBanner = this.page.locator('#artdeco-global-alert-container');
        this.cookiesAcceptBtn = this.cookieBanner.locator('//button[@action-type="ACCEPT"]');
        this.userenameInput = this.page.locator('#username');
        this.passwordInput = this.page.locator('#password');
        this.signInBtn = this.page.locator('button[type="submit"]');
    }

    async visitLoginPage() {
        await this.page.goto('https://www.linkedin.com/login/');
    }

    async acceptCookies() {
        await this.cookiesAcceptBtn.click();
    }

    async login(username, password) {
        await this.userenameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInBtn.click();
        await this.page.waitForLoadState("domcontentloaded");
    }

}

module.exports = { LinkedinLoginPage }