export const PostFactory = {
  valid: (overrides = {}) => ({
    title:  'Playwright API Testing Portfolio',
    body:   'Demonstrating senior SDET skills with Playwright + TypeScript',
    userId: 1,
    ...overrides,
  }),
  missingTitle: () => ({ body: 'No title here', userId: 1 }),
  missingUserId: () => ({ title: 'No userId', body: 'Test body' }),
  longTitle: () => ({ title: 'A'.repeat(300), body: 'Body', userId: 1 }),
};

export const TodoFactory = {
  incomplete: (overrides = {}) => ({
    title:     'Write Playwright tests',
    completed: false,
    userId:    1,
    ...overrides,
  }),
  complete: (overrides = {}) => ({
    title:     'Deploy CI pipeline',
    completed: true,
    userId:    1,
    ...overrides,
  }),
};
