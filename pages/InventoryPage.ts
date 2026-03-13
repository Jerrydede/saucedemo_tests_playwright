import { Page, Locator } from '@playwright/test';

/**
 * Represents the Inventory Page (Product Catalog).
 * Provides methods to interact with products and the shopping cart.
 */
export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Main container for all product cards
    this.inventoryItems = page.locator('.inventory_item');
    // The number badge appearing on the cart icon
    this.cartBadge = page.locator('.shopping_cart_badge');
    // The link to navigate to the cart page
    this.cartLink = page.locator('.shopping_cart_link');
  }

  /**
   * Adds a specific product to the cart using its unique data-test attribute.
   * @param productKey - The unique suffix of the data-test attribute (e.g., 'sauce-labs-backpack').
   */
  async addItemToCart(productKey: string) {
    await this.page.locator(`[data-test="add-to-cart-${productKey}"]`).click();
  }

  /**
   * Removes a specific product from the cart.
   * @param productKey - The unique suffix of the data-test attribute (e.g., 'sauce-labs-backpack').
   */
  async removeItemFromCart(productKey: string) {
    await this.page.locator(`[data-test="remove-${productKey}"]`).click();
  }
}