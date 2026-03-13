import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { TEST_DATA } from '../data/testData';

test.describe('Authentication Regression Test Suite', () => {
  // 1. Module-level declarations (Scope: available to all tests in this describe block)
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  // 2. Setup: Initialize Page Objects and navigate to base URL before every test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  // Data for parameterized login tests
  const validUsers = [
    TEST_DATA.users.standard,
    TEST_DATA.users.problem,
    TEST_DATA.users.performance,
    TEST_DATA.users.error,
    TEST_DATA.users.visual
  ];

  /**
   * REG-01: Verify successful login with valid credentials (Data Driven)
   */
  for (const username of validUsers) {
    test(`should login successfully with ${username}`, async ({ page }) => {
      await loginPage.login(username, TEST_DATA.password);
      // Verify successful redirection to inventory
      await expect(page).toHaveURL(/.*inventory.html/);
    });
  }

  /**
   * REG-02: Ensure account security by verifying locked_out status
   */
  test('should show error for locked_out_user', async () => {
    await loginPage.login(TEST_DATA.users.lockedOut, TEST_DATA.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  /**
   * REG-03: Verify unsuccessful login with invalid password
   */
  test('should show error for invalid password', async () => {
    await loginPage.login(TEST_DATA.users.standard, TEST_DATA.invalidPassword);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  /**
   * REG-04: Verify unsuccessful login with not available user
   */
  test('should show error for not available user', async () => {
    await loginPage.login(TEST_DATA.users.notAvailable, TEST_DATA.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  /**
   * REG-05: Verify logout cycle
   */
  test('should logout successfully and redirect to login page', async ({ page }) => {
    // Step 1: Login
    await loginPage.login(TEST_DATA.users.standard, TEST_DATA.password);
    
    // Step 2: Logout using the Inventory Page sidebar
    await inventoryPage.logout();

    // Step 3: Assertions
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});