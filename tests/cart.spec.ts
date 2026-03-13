import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { TEST_DATA } from '../data/testData';

test.describe('Cart Content Regression', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_DATA.users.standard, TEST_DATA.password);
  });

  /**
   * REG-08: Verify cart integrity with a full product set.
   */
  test('should display all 6 products in the cart view', async () => {
    for (const productKey of TEST_DATA.products) {
      await inventoryPage.addItemToCart(productKey);
    }
    await inventoryPage.cartLink.click();
    
    // Verify list length matches data
    const count = await cartPage.cartItems.count();
    expect(count).toBe(TEST_DATA.products.length);
  });

  /**
   * REG-09: Verify navigation logic from the cart.
   */
  test('should allow navigating back to inventory to continue shopping', async ({ page }) => {
    await inventoryPage.cartLink.click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  /**
   * REG-10: Verify transition to the checkout flow.
   */
  test('should proceed to checkout step one when items are present', async ({ page }) => {
    await inventoryPage.addItemToCart(TEST_DATA.products[0]);
    await inventoryPage.cartLink.click();
    
    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });
});