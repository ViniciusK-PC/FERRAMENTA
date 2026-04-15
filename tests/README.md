# Hex Stalcke Testing Suite

Comprehensive testing infrastructure for the Hex Stalcke AI ecosystem.

## Structure

```
tests/
├── unit/
│   ├── backend/           # pytest (Python)
│   │   ├── conftest.py    # pytest fixtures
│   │   ├── test_port_scanner.py
│   │   ├── test_hex_scanner.py
│   │   ├── test_phone_tracker.py
│   │   └── test_frontend_generator.py
│   └── frontend/          # Vitest (TypeScript)
│       ├── setup.ts
│       ├── api-client.test.ts
│       ├── utils.test.ts
│       └── components.test.tsx
└── e2e/                   # Playwright (E2E with Video)
    ├── playwright.config.ts
    ├── auth.spec.ts
    ├── scanner.spec.ts
    ├── phonetracker.spec.ts
    └── cloner.spec.ts
```

## Quick Start

### 1. Install Dependencies

```bash
npm run test:install
```

### 2. Run All Tests

```bash
npm test
```

### 3. Run by Category

```bash
# Backend unit tests (pytest)
npm run test:backend

# Frontend unit tests (vitest)
npm run test:frontend

# E2E tests with video (playwright)
npm run test:e2e
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:backend` | Run Python backend tests |
| `npm run test:frontend` | Run TypeScript frontend tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:headed` | Run E2E with visible browser |
| `npm run test:e2e:ui` | Run E2E with Playwright UI |
| `npm run test:debug` | Debug E2E tests |
| `npm run test:report` | Show Playwright HTML report |
| `npm run test:coverage` | Generate coverage report |

## Video Recording

All E2E tests record video by default:
- Videos are saved in `test-results/` directory
- Videos are retained on failure for debugging
- Format: `.webm`

## Prerequisites

### Backend Tests
- Python 3.8+
- pytest, pytest-asyncio, pytest-mock

### Frontend Tests
- Node.js 18+
- Vitest, @testing-library/react

### E2E Tests
- Node.js 18+
- @playwright/test
- Chromium (auto-installed)

## Services Required for E2E

Start these services before running E2E tests:

```bash
# Terminal 1: Backend
npm run backend

# Terminal 2: Frontend  
npm run frontend
```

## Test Reports

- **Playwright**: HTML report at `playwright-report/index.html`
- **Vitest**: Console output with coverage
- **Pytest**: Console output with details

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8888` | Backend API URL |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL |
| `BOT_URL` | `http://localhost:3005` | Discord Bot URL |

## Exit Codes

- `0`: All tests passed
- `1`: One or more tests failed
- `2`: Test interrupted
- `3`: Internal error
