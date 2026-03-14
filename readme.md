
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
npx playwright install chromium firefox webkit


# 1. Install all dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. List tests
npx playwright test --list

# 4. Run smoke test
npx playwright test smoke.spec.ts


