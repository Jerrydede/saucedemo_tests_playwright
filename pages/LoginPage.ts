import { Page, Locator, expect } from '@playwright/test';
import { TEST_DATA } from '../data/testData';

/**
 * Represents the Login Page of the SauceDemo shop.
 * Handles authentication and error messaging.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto(TEST_DATA.baseUrl);
  }

/**
 * Performs login with given credentials
 * @param user - The username from the accepted user list.
 * @param pass - The secret_sauce password.
 */
  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}