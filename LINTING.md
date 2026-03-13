# Linting & Code Formatting Guide

This project uses **ESLint** and **Prettier** to maintain code quality and consistent formatting.

## Setup

Install all linting dependencies:
```bash
npm install
```

## Available Commands

### Linting
- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Auto-fix linting issues (where possible)

### Formatting
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

### Combined
```bash
npm run lint:fix && npm run format
```

## Configuration Files

### `.eslintrc.json`
ESLint configuration with TypeScript support:
- Enforces TypeScript best practices
- Uses Prettier plugin for code style
- Configured for test files (.spec.ts, .test.ts)
- Rules for naming conventions, variable declarations, and more

### `.prettierrc.json`
Prettier configuration:
- Single quotes
- 2-space tab width
- Semicolons required
- Trailing commas (ES5 style)
- 100 character line width

### `.eslintignore`
Files and directories ignored by ESLint:
- node_modules, dist, build
- Generated files and reports
- Environment files

### `.prettierignore`
Files and directories ignored by Prettier:
- Same as ESLint plus markdown files

## Key Rules

### TypeScript Rules
- Explicit return types on functions (with exceptions)
- No `any` types (warnings)
- Unused variables must start with `_`
- Proper naming conventions (camelCase for variables, PascalCase for types)

### Code Style Rules
- Prefer `const` over `var`
- Require semicolons
- Use single quotes
- No console.log in production code (warnings allowed for console.warn/error)
- Use `===` instead of `==`

### Test File Rules
- More lenient for test files (.spec.ts)
- Allow `any` types in tests

## Pre-commit Hook (Optional)

To auto-format files before commits, install husky and lint-staged:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run lint:fix && npm run format"
```

## Integration with IDEs

### VS Code
Install extensions:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Add to `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Troubleshooting

### "Cannot find module" errors during linting
Run `npm install` again to ensure all ESLint plugins are installed.

### Format conflicts between ESLint and Prettier
ESLint is configured with Prettier plugin to avoid conflicts. Run both:
```bash
npm run lint:fix && npm run format
```

### TypeScript errors during linting
Ensure `tsconfig.json` is in the project root and is valid.

## CI/CD Integration

Add to your pipeline:
```bash
npm run lint
npm run format:check
npm run build
npm test
```

This ensures code quality checks pass before tests run.
