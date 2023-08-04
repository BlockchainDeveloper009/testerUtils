import { test, expect } from '@playwright/test';
let baseUrl = 'https://www.google.com'
let baseGoogleSearcUrl = 'https://www.google.com'
let baseYoutubeUrl = 'https://www.youtube.com'


test('index_in_youtube_1', async ({ page }) => {
    // await page.goto(baseYoutubeUrl);
    //   //textarea[class='gLFyf']
    //   await page.locator("input[id='search']").fill('@babieszone2k and babies zone')
    // // Expect a title "to contain" a substring.
    // await page.keyboard.press('Enter');
    await page.goto('https://www.youtube.com/watch?v=4OXbpGhjXHo');
    //textarea[class='gLFyf']
    
  // Expect a title "to contain" a substring.
  await page.keyboard.press('Enter');
  await page.waitForTimeout(60000);

});

// test('index_in_youtube_2', async ({ page }) => {
//   // await page.goto(baseYoutubeUrl);
//   //   //textarea[class='gLFyf']
//   //   await page.locator("input[id='search']").fill('@babieszone2k and babies zone')
//   // // Expect a title "to contain" a substring.
//   // await page.keyboard.press('Enter');
//   await page.goto('https://www.youtube.com/watch?v=4OXbpGhjXHo');
//   //textarea[class='gLFyf']
  
// // Expect a title "to contain" a substring.
// await page.keyboard.press('Enter');
// await page.waitForTimeout(60000);

// });

// test('index_in_youtube_3', async ({ page }) => {
//   // await page.goto(baseYoutubeUrl);
//   //   //textarea[class='gLFyf']
//   //   await page.locator("input[id='search']").fill('@babieszone2k and babies zone')
//   // // Expect a title "to contain" a substring.
//   // await page.keyboard.press('Enter');
//   await page.goto('https://www.youtube.com/watch?v=4OXbpGhjXHo');
//   //textarea[class='gLFyf']
  
// // Expect a title "to contain" a substring.
// await page.keyboard.press('Enter');
// await page.waitForTimeout(7000);

// });

  
