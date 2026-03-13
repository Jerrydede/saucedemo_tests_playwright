import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_DATA } from '../data/testData'; 

test.describe('Authentication Regression Test Suite', () => {

  //Test for all the users except the locked one and the not available one
  const validUsers = [
    TEST_DATA.users.standard,
    TEST_DATA.users.problem,
    TEST_DATA.users.performance,
    TEST_DATA.users.error,
    TEST_DATA.users.visual
  ];


  //REG-01: Verify successful login with valid credentials
  for (const username of validUsers) {
    test(`should login successfully with ${username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, TEST_DATA.password);
    
      // Verify successful redirection to inventory
      await expect(page).toHaveURL(/.*inventory.html/);
    });
  }
  

  //REG-02: Ensure account security by verifying locked_out status
  test('should show error for locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_DATA.users.lockedOut, TEST_DATA.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  //REG-03: Verify unsuccessful login with invalid password
  test('should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_DATA.users.standard, TEST_DATA.invalidPassword);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  })

  //REG-04: Verify unsuccessful login with not available user
  test('should show error for not available user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_DATA.users.notAvailable, TEST_DATA.password);
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  })
  
});