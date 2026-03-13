# Troubleshooting - Tests Not Appearing in Test Explorer

## Issue
testerUtils tests don't appear in VS Code Test Explorer, even though test files exist.

## Solution Steps

### Step 1: Reload VS Code
The Playwright extension may need to be restarted.

```bash
1. Press Ctrl+Shift+P
2. Type "Developer: Reload Window"
3. Press Enter
```

### Step 2: Verify Workspace Is Opened Correctly

```bash
# Close VS Code

# Navigate to the repos root
cd c:\Users\hxkris\source\repos

# Open with the workspace file (NOT just a folder)
code repos.code-workspace
```

**Important**: Opening with `code .` will NOT work with multi-root workspaces. You MUST use the `.code-workspace` file.

### Step 3: Verify Playwright Extension Recognizes Project

1. **Check Test Explorer**
   - Click on Testing icon (left sidebar)
   - You should see the testerUtils project listed
   - Expand it to see test files

2. **If still not showing:**
   - Click the `...` menu in Test Explorer
   - Select "Show Browser"  
   - Verify Playwright extension is active

### Step 4: Check For Errors in Output Panel

1. Click "Output" panel at bottom
2. Select "Playwright Test for VSCode" from dropdown
3. Look for error messages

**Common errors and fixes:**

| Error | Fix |
|-------|-----|
| `Cannot find module '@playwright/test'` | Run `npm install` in testerUtils folder |
| `config.ts not found` | Verify `utils/config.ts` exists |
| `globalSetup.ts failed` | Check globalSetup.ts for syntax errors |
| `ENOENT: no such file` | Check all file paths in playwright.config.ts |

### Step 5: Verify Dependencies Are Installed

```bash
cd c:\Users\hxkris\source\repos\Node\testerUtils

# Check if node_modules exists
dir node_modules | find "@playwright"

# If not, install
npm install

# Verify @playwright/test is installed
npm list @playwright/test
```

### Step 6: Check typescript Compilation

```bash
cd c:\Users\hxkris\source\repos\Node\testerUtils

# Build the project
npm run build

# Check for errors
npm run lint
```

### Step 7: Verify Test Files Are Discoverable

Look for test files matching these patterns:
- `**/*.spec.ts`
- `**/*.spec.js`
- `**/*.test.ts`
- `**/*.test.js`

Files that should be visible:
```
tests/
  ├── smoke.spec.ts          ← Simple test (no complex imports)
  ├── example_configuration.spec.ts
  ├── example_api_testing.spec.ts
  ├── example_structured_logging.spec.ts
  ├── example_test_data_management.spec.ts
  └── example.spec.ts
```

### Step 8: Run Tests from Command Line to Verify They Work

```bash
cd c:\Users\hxkris\source\repos\Node\testerUtils

# List all available tests
npx playwright test --list

# Run tests
npm test

# Run specific test
npx playwright test smoke.spec.ts
```

If tests run from command line but don't show in VS Code, the issue is with the extension discovery, not the tests themselves.

### Step 9: Clear Playwright Extension Cache

```bash
1. Close VS Code
2. Remove cache:
   - Windows: %USERPROFILE%\.playwright
   - Or in VS Code: 
     - Cmd+Shift+P > "Developer: Open Folder Settings"
     - Look for .playwright folder
3. Reopen workspace with: code repos.code-workspace
4. Extension will rebuild cache
```

### Step 10: Check Playwright Config Is Valid

Run this from testerUtils root:

```bash
# Validate the config
npx playwright test --list

# If this works but extension doesn't show tests, it's an extension issue
```

---

## Quick Checklist

- [ ] VS Code opened with `code repos.code-workspace` (not `code .`)
- [ ] Window reloaded (Ctrl+Shift+P → "Reload Window")
- [ ] `npm install` run in testerUtils folder
- [ ] `@playwright/test` installed: `npm list @playwright/test`
- [ ] `playwright.config.ts` exists in testerUtils root
- [ ] Test files exist in `tests/` directory
- [ ] `.spec.ts` files contain proper test syntax
- [ ] No errors in Output panel (Playwright Test for VSCode)
- [ ] `npm test` works from command line
- [ ] Simple smoke test file exists: `tests/smoke.spec.ts`

---

## If Tests Still Don't Appear

Try this nuclear option:

```bash
cd c:\Users\hxkris\source\repos\Node\testerUtils

# Remove all caches
rm -r node_modules
rm -r .playwright
rm package-lock.json

# Reinstall from scratch
npm install

# Rebuild
npm run build

# List tests to verify
npx playwright test --list
```

Then reload VS Code:
```bash
# Close everything
# Navigate to repos root
cd c:\Users\hxkris\source\repos

# Reopen workspace
code repos.code-workspace
```

---

## Still Having Issues?

Try these diagnostic commands:

```bash
# Check Playwright version
npm list @playwright/test

# Check TypeScript version
npm list typescript

# Check if globalSetup.ts has syntax errors
npx tsc --noEmit utils/globalSetup.ts

# Check if config.ts has syntax errors
npx tsc --noEmit utils/config.ts

# Detailed list with all test info
npx playwright test --list --reporter=verbose
```

---

## Success Indicators

You'll know it's working when:
1. ✅ Test Explorer shows testerUtils project
2. ✅ Test names are expandable and clickable
3. ✅ Clicking test runs it in editor
4. ✅ Gutter icons appear next to `test()` calls
5. ✅ Command output shows test names: `npx playwright test --list`

---

## See Also

- [Playwright Discovery Guide](./PLAYWRIGHT_DISCOVERY.md)
- [Configuration Guide](./CONFIGURATION.md)
- [Workspace Setup](./repos.code-workspace)
