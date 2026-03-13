import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { TEST_DATA } from '../data/testData';

test.describe('Product Catalog Regression', () => {
  let inventoryPage: InventoryPage;

  // Setup: Login before each test to reach the inventory page
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(TEST_DATA.users.standard, TEST_DATA.password);
  });

  /**
   * REG-05: Verify that the product list is populated and visible.
   */
  test('should display the product list', async () => {
    const itemCount = await inventoryPage.inventoryItems.count();
    expect(itemCount).toBeGreaterThan(0);
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
  });

  /**
   * REG-06: Verify the full cycle of adding and removing an item.
   */
  test('should add and then remove an item from the cart', async () => {
    const productKey = 'sauce-labs-backpack';

    // Step 1: Add item and verify badge count
    await inventoryPage.addItemToCart(productKey);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Step 2: Remove item and verify badge is gone
    await inventoryPage.removeItemFromCart(productKey);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});