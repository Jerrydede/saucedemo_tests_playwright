import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { TEST_DATA } from '../data/testData';

test.describe('Final Checkout Regression', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_DATA.users.standard, TEST_DATA.password);
    
  });

  /**
   * REG-11: Verify full checkout flow from info entry to order completion.
   */
  test('should complete the purchase successfully', async () => {
    // Setup: Add one item and go to cart
    await inventoryPage.addItemAndGetPrice(TEST_DATA.products[0]);
    await inventoryPage.cartLink.click();
    await cartPage.checkoutButton.click();

    // Step 1: Form entry
    await checkoutPage.fillCustomerInfo(TEST_DATA.customer.firstName, TEST_DATA.customer.lastName, TEST_DATA.customer.zipCode);
    
    // Step 2: Overview page
    await expect(checkoutPage.finishButton).toBeVisible();
    await checkoutPage.finishButton.click();

    // Step 3: Confirmation
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  /**
   * REG-12: Verify the summary prices
   */
  test('should verify that the subtotal matches the sum of added products', async () => {
    // 1. Add items and track their prices dynamically
    const price1 = await inventoryPage.addItemAndGetPrice(TEST_DATA.products[0]);
    const price2 = await inventoryPage.addItemAndGetPrice(TEST_DATA.products[1]);
    const price3 = await inventoryPage.addItemAndGetPrice(TEST_DATA.products[2]);
    const expectedSum = price1 + price2 + price3;

    // 2. Navigate to Checkout Overview
    await inventoryPage.cartLink.click();
    await inventoryPage.page.locator('[data-test="checkout"]').click();
    await checkoutPage.fillCustomerInfo(TEST_DATA.customer.firstName, TEST_DATA.customer.lastName, TEST_DATA.customer.zipCode);

    // 3. Extract the displayed subtotal
    const subtotalRaw = await checkoutPage.subtotalLabel.innerText();
    const displayedSubtotal = parseFloat(subtotalRaw.replace('Item total: $', ''));

    // 4. Verification
    expect(displayedSubtotal).toBe(expectedSum);
    
    // Optional: Verify that Total = Subtotal + Tax
    const taxRaw = await checkoutPage.taxLabel.innerText();
    const tax = parseFloat(taxRaw.replace('Tax: $', ''));
    
    const totalRaw = await checkoutPage.totalLabel.innerText();
    const displayedTotal = parseFloat(totalRaw.replace('Total: $', ''));
    
    expect(displayedTotal).toBe(displayedSubtotal + tax);
  });
});