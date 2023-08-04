import { test, expect } from '@playwright/test';
let baseUrl = 'https://www.google.com'
let baseGoogleSearcUrl = 'https://www.google.com'
let baseYoutubeUrl = 'https://www.youtube.com'
test('index in google', async ({ page }) => {
  await page.goto(baseGoogleSearcUrl);
    //textarea[class='gLFyf']
    await page.locator("textarea[class='gLFyf']").fill('@babieszone2k and Rattle toy, the best sound for baby sleep, turn it on if the baby')
  // Expect a title "to contain" a substring.
  await page.keyboard.press('Enter');
});
//baby toys #babydumbells #rattledumbells #dumbells #coolbabieszone2k @babieszone2k

test('index in youtube', async ({ page }) => {
    // await page.goto(baseYoutubeUrl);
    //   //textarea[class='gLFyf']
    //   await page.locator("input[id='search']").fill('@babieszone2k and babies zone')
    // // Expect a title "to contain" a substring.
    // await page.keyboard.press('Enter');
    await page.goto('https://www.youtube.com/watch?v=4OXbpGhjXHo');
    //textarea[class='gLFyf']
    
  // Expect a title "to contain" a substring.
  await page.keyboard.press('Enter');
  await page.waitForTimeout(7000);

  });

  test('index in youtube', async ({ page }) => {
    // await page.goto(baseYoutubeUrl);
    //   //textarea[class='gLFyf']
    //   await page.locator("input[id='search']").fill('@babieszone2k and babies zone')
    // // Expect a title "to contain" a substring.
    // await page.keyboard.press('Enter');
    await page.goto('https://www.youtube.com/watch?v=4OXbpGhjXHo');
    //textarea[class='gLFyf']
    
  // Expect a title "to contain" a substring.
  await page.keyboard.press('Enter');
  await page.waitForTimeout(7000);

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
