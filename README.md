# SauceDemo Regression Testing Suite

This repository contains a full regression testing suite for the SauceDemo webshop. The goal of this project is to automate the testing of all shop functionalities to ensure high quality and stability.

A professional, end-to-end regression testing framework built with **Playwright** and **TypeScript**. This suite covers the critical user paths and business logic of the [SauceDemo](https://www.saucedemo.com/) e-commerce platform.

This project follows the **Page Object Model (POM)** to ensure the code is maintainable, scalable, and easy to read.

* **Page Objects (`/pages`)**: Encapsulates UI locators and common actions (e.g., `login()`, `logout()`, `handleCart()`).
* **Data-Driven Testing (`/data`)**: All environment URLs, user credentials, and expected error strings are centralized in `testData.ts`.
* **Atomic Assertions**: Each test is independent. We use `beforeEach` hooks to initialize page objects and navigate, ensuring a clean state for every test case.

## Key Regression Features

* **Multi-User Authentication**: Validates various user personas (Standard, Problem, Performance) and ensures proper error handling for locked-out users.
* **Dynamic Cart Logic**: Includes a robust test that adds/removes multiple items via a loop, verifying that the cart badge updates dynamically and disappears when the cart is empty.
* **Price Integrity**: Automatically captures individual product prices and verifies that the Checkout Overview correctly calculates the **Subtotal**, **Tax**, and **Total**.
* **Session Management**: Includes a dedicated logout flow via the sidebar menu to ensure secure session termination.

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <project-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install Playwright Browsers:**
    ```bash
    npx playwright install --with-deps
    ```