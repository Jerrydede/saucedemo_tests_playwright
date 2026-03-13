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

  /**
   * REG-07: Shopping Cart Accumulation & Deletion Regression
   * Verify that the cart badge correctly increments to 6 as all products are added and then decrements back to 0
   */
  test('should correctly increment cart badge when adding all products', async () => {
    const products = TEST_DATA.products;
    
    // Part1: add all items
    // Iterate through the product list from testData.ts
    for (let i = 0; i < products.length; i++) {
      await inventoryPage.addItemToCart(products[i]);
      
      // Calculate expected count (index starts at 0, so we add 1)
      const expectedCount = (i + 1).toString();
      
      // Verification: Check if the badge updates correctly after each click
      await expect(inventoryPage.cartBadge).toHaveText(expectedCount);
    }

    // Part2: remove all items
    // We loop backwards to simulate a natural removal process
    for (let i = products.length - 1; i >= 0; i--) {
      // The product index is i
      await inventoryPage.removeItemFromCart(products[i]);
      
      // Calculate expected count
      const expectedCount = i.toString();
      
      if (i > 0) {
        // Verification: Check if the badge updates correctly after each click
      await expect(inventoryPage.cartBadge).toHaveText(expectedCount);
      } else {
        // For the last item, we expect the badge to be gone
        await expect(inventoryPage.cartBadge).toHaveCount(0);
      }
      
    }

  });
});