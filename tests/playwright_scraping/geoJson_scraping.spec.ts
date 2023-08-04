import { test, expect } from '@playwright/test';

let urls = [
  'http://geojson.io/#map=3.93/41.34/-113.64',
'https://opengeoscience.github.io/geojs/examples/geoJSON/',
'http://geojson.io/#map=4.98/50.11/-122.75']
let url = urls[2];


test('has title', async ({ page }) => {
  await page.goto(url);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('geojson.io');
});

test('get started link', async ({ page }) => {
  await page.goto(url);

  // Click the get started link.
  //await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  


});
test('test', async ({ page }) => {
  await page.goto('http://geojson.io/#map=4.98/50.11/-122.75');
  await page.getByRole('button', { name: 'Draw Polygon (p)' }).click();
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 397,
      y: 524
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 386,
      y: 573
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 500,
      y: 587
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 624,
      y: 548
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 488,
      y: 454
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 413,
      y: 383
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 608,
      y: 621
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 752,
      y: 527
    }
  });
  await page.getByRole('region', { name: 'Map' }).click({
    position: {
      x: 706,
      y: 147
    }
  });
  await page.getByRole('button', { name: 'Draw Point (m)' }).click();
  await page.getByRole('button', { name: '' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('GeoJSON', { exact: true }).click();
  const download = await downloadPromise;
});