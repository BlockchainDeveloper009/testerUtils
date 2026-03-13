# Environment Configuration & CI/CD Integration

This document covers the environment variable management, configuration, and CI/CD integration features in testerUtils.

## Quick Start

### 1. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
# BASE_URL=http://your-app:3000
# ENV_LOC=dev
# API_TIMEOUT=30000
```

### 2. Run Tests

```bash
# Local development (loads .env)
npm test

# Specific environment
npm run test:dev      # Uses dev environment
npm run test:stage    # Uses stage environment

# CI mode (with full logging and JUnit output)
npm run test:ci      # Generates test-results/junit.xml
```

---

## Environment Variables

### Application Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:3000` | Application base URL for UI tests |
| `ENV_LOC` | `dev` | Environment: dev, test, stage, prod |
| `API_BASE_URL` | `http://localhost:3001` | API server URL |
| `API_TIMEOUT` | `30000` | Request timeout in milliseconds |
| `DEBUG` | `false` | Enable debug-level logging |

### Authentication
| Variable | Default | Description |
|----------|---------|-------------|
| `AUTH_TOKEN` | (none) | Bearer token for API authentication |
| `AUTH_USERNAME` | (none) | Username for API authentication |
| `AUTH_PASSWORD` | (none) | Password for API authentication |

### Feature Flags
| Variable | Default | Description |
|----------|---------|-------------|
| `ENV_FILE` | `.env` | Custom .env file path |
| `SKIP_CONNECTIVITY_CHECK` | `false` | Skip base URL connectivity test |
| `CI` | `false` | Set to true in CI environments |

---

## Configuration Management

### Using Configuration in Tests

```typescript
import config from '../utils/config';
import { logger, ApiHelper } from '@lib/index';

test('my test', async () => {
  // Access configuration
  logger.info('Configuration', {}, {
    baseUrl: config.baseUrl,
    environment: config.environment,
    apiTimeout: config.apiTimeout,
    debugMode: config.debug,
  });

  // Use dynamic base URL
  const api = new ApiHelper(config.baseUrl);
  
  // API client respects API_TIMEOUT
  const response = await api.get('/endpoint');
});
```

### Configuration Object

```typescript
interface Config {
  baseUrl: string;           // Application URL
  apiBaseUrl: string;        // API server URL
  environment: 'dev' | 'test' | 'stage' | 'prod';
  apiTimeout: number;        // Request timeout in ms
  debug: boolean;            // Debug mode enabled
  authToken?: string;        // Bearer token
  authUsername?: string;     // Username credential
  authPassword?: string;     // Password credential
}
```

---

## Global Setup Hook

The `utils/globalSetup.ts` file runs **once before all tests** and:

1. **Logs Environment Configuration** - All settings that will be used
2. **Verifies Base URL Connectivity** - Ensures the app is reachable
3. **Logs Browser Versions** - Which browsers are installed
4. **Validates Configuration** - Errors on missing required settings

### Customizing Global Setup

```typescript
// utils/globalSetup.ts
async function globalSetup(config: FullConfig): Promise<void> {
  // Add custom initialization here
  logger.info('Setting up test environment', {});
  
  // Example: Create test data
  // const api = new ApiHelper(process.env.API_BASE_URL);
  // await api.post('/test-data/seed', {...});
}
```

---

## Playwright Configuration

The updated `playwright.config.ts` includes:

### Reporters

**Dual reporters for CI and local development:**

```typescript
reporter: [
  ['junit', { outputFile: 'test-results/junit.xml' }],  // For CI pipelines
  ['html', { outputFolder: 'playwright-report' }],      // For analysis
]
```

### Environment-Aware Settings

```typescript
// Full traces in CI, minimal locally
trace: process.env.CI ? 'on' : 'on-first-retry',

// Capture failures
screenshot: 'only-on-failure',

// Dynamic base URL
baseURL: process.env.BASE_URL || 'http://localhost:3000',
```

### Safe dotenv Loading

```typescript
const envPath = process.env.ENV_FILE || '.env';
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
```

---

## CI/CD Integration

### Running Tests in CI

```bash
# Set CI flag and run tests
CI=true npm test

# Or use the dedicated script
npm run test:ci
```

**Automatic Changes in CI Mode:**
- ✅ Headless browser mode (faster)
- ✅ Full trace collection (better debugging)
- ✅ JUnit XML output (pipeline reporting)
- ✅ Single worker (consistent results)
- ✅ 2 retries on failure (handles flakes)

### Example Azure Pipelines YAML

```yaml
steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'

  - script: npm install
    displayName: 'Install dependencies'

  - script: npm run build
    displayName: 'Build project'

  - script: npm run lint
    displayName: 'Lint code'

  - script: npm run test:ci
    displayName: 'Run tests'
    env:
      CI: true
      BASE_URL: $(BASE_URL)
      ENV_LOC: test
      API_TIMEOUT: 30000

  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: '**/junit.xml'

  - task: PublishBuildArtifacts@1
    condition: always()
    inputs:
      pathtoPublish: 'playwright-report'
      artifactName: 'playwright-reports'
```

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run build
      - run: npm run lint
      
      - run: npm run test:ci
        env:
          CI: true
          BASE_URL: ${{ secrets.TEST_BASE_URL }}

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Environment-Specific Testing

### Run Tests Against Different Environments

```bash
# Development
npm run test:dev              # Uses ENV_LOC=dev

# Staging
npm run test:stage            # Uses ENV_LOC=stage

# With custom environment
ENV_LOC=prod npm test

# With custom base URL
BASE_URL=https://prod.example.com npm test
```

### Environment-Specific Logic in Tests

```typescript
import config from '../utils/config';

test('environment-specific behavior', async () => {
  if (config.environment === 'dev') {
    // Dev-only behavior
    await api.post('/debug/reset');
  }
  
  if (config.environment === 'prod') {
    // Production-only checks
    expect(process.env.AUTH_TOKEN).toBeDefined();
  }
  
  // All environments
  const response = await api.get('/health');
  expect(response.status).toBe(200);
});
```

---

## Testing Configuration Examples

Run the configuration examples to see all features in action:

```bash
npm run test:config
```

This runs interactive tests demonstrating:
- Configuration access
- Dynamic base URLs
- Environment-specific settings
- CI conditional logic
- Debug mode features
- JUnit output generation

---

## Troubleshooting

### "BASE_URL is required"

```bash
# Solution: Create .env file
cp .env.example .env
# Edit and set BASE_URL
```

### Tests timeout with connectivity check

```bash
# Skip the connectivity verification
SKIP_CONNECTIVITY_CHECK=true npm test
```

### Custom .env file not loading

```bash
# Specify custom env file path
ENV_FILE=.env.custom npm test
```

### CI behaving differently than local

```bash
# Test locally with CI simulation
CI=true npm test
```

---

## Best Practices

1. **Never commit .env files**
   - Use `.env.example` as template
   - `.gitignore` already configured

2. **Validate configuration early**
   - `config.ts` validates on import
   - Global setup verifies connectivity

3. **Use environment-specific settings**
   - Different timeouts per environment
   - Auth tokens from secrets in CI

4. **Log environment in test output**
   - Helps debug CI failures
   - Global setup logs this automatically

5. **Use secrets in CI/CD**
   - Never hardcode credentials
   - GitHub: Use `${{ secrets.NAME }}`
   - Azure: Use `$(SECRET_VARIABLE)`

---

## See Also

- [LINTING.md](./LINTING.md) - Code quality configuration
- [tests/example_configuration.spec.ts](./tests/example_configuration.spec.ts) - Configuration examples
- [utils/config.ts](./utils/config.ts) - Configuration implementation
- [utils/globalSetup.ts](./utils/globalSetup.ts) - Global setup implementation
