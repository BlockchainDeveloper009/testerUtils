import { test, expect } from '@playwright/test';
let baseUrl = 'https://lively-water-090ead610.3.azurestaticapps.net'
test('has title', async ({ page }) => {
  await page.goto(baseUrl);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto(baseUrl);

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});



test('krumpkings azure v1.0.0', async ({ page }) => {
  await page.goto('https://lively-water-090ead610.3.azurestaticapps.net/');
  await page.getByRole('link', { name: 'My Collections' }).click();
  await page.getByRole('img', { name: 'Krump Kings Logo1' }).click({
    button: 'right'
  });
  await page.getByRole('link', { name: 'Mint NFT' }).click();
  await page.getByRole('heading', { name: 'Krump Kings Nft Minting Website' }).click();
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  await page.getByRole('button', { name: 'MetaMask' }).click();
  await page.getByRole('button').first().click();
  await page.getByRole('heading', { name: 'Choose your wallet' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByText('2 / 5').click();
  await page.getByText('2').click({
    button: 'right'
  });
  await page.getByRole('link', { name: 'Contact Us' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByText('Round 1').click({
    button: 'right'
  });
  await page.getByRole('link', { name: 'Mint NFT' }).click();
});
