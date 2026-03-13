
# 1. Install all dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. List tests
npx playwright test --list

# 4. Run smoke test
npx playwright test smoke.spec.ts