/**
 * Simple smoke test - no complex imports
 * Used to verify Playwright test discovery is working
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Simple Discovery Test', () => {
  test('test 1: verify Playwright works', async () => {
    expect(true).toBe(true);
  });

  test('test 2: verify test naming', async () => {
    const result = 1 + 1;
    expect(result).toBe(2);
  });

  test('test 3: verify async works', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(true).toBe(true);
  });
});
