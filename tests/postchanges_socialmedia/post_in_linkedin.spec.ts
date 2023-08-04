import { test, expect } from '@playwright/test';
let baseDiceUrl = 'https://www.dice.com/job-detail/e5ff20d6-5102-4e0c-84f2-9080b6ba9376?src=32&utm_source=appcast&utm_medium=aggregator&utm_campaign=linkedin-dice-paid&utm_term=Motion%20Recruitment&_ccid=16880712883325t6gu06yt'
let baseLinkedInSearcUrl = 'https://www.google.com'
let linkedPwd = 'Iamhero123$'
let defiCompany = [
  {
    'companyName': 'alkemi',
    'url': 'https://alkemi.network/about',
    "jobPos" : ["Distributed Systems Engineer"]
    
  },
  {
    'companyName': 'coinbase',
    'companyUrl': 'https://alkemi.network/about',
    "jobPos" : ["Distributed Systems Engineer"]
    
  },
  
]
test('post in linkedin', async ({ page }) => {
  await page.goto(baseLinkedInSearcUrl);
    //textarea[class='gLFyf']
    await page.locator("input[name=session_key]").fill('blkcdev@gmail.com')
  // Expect a title "to contain" a substring.
  await page.locator("input[name='session_password']").fill(linkedPwd)
  await page.locator("button[data-id='sign-in-form__submit-btn']").click();
  
});


test('post in linkedin', async ({ page }) => {
  await page.goto(baseLinkedInSearcUrl);
    //textarea[class='gLFyf']
    await page.locator("input[name=session_key]").fill('blkcdev@gmail.com')
  // Expect a title "to contain" a substring.
  await page.locator("input[name='session_password']").fill(linkedPwd)
  await page.locator("button[data-id='sign-in-form__submit-btn']").click();
  
});




  

