import { test as base } from '@playwright/test';
import { JsonPlaceholderClient } from '../api-clients/JsonPlaceholderClient';

type Fixtures = {
  api: JsonPlaceholderClient;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new JsonPlaceholderClient(request));
  },
});

export { expect } from '@playwright/test';
