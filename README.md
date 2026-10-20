# SahaySetu NGO

SahaySetu is an HCI-focused platform connecting NGOs, volunteers, and citizens to discover government schemes, manage NGO activities, apply for opportunities, and engage through a simple human-centered interface.

---

## Developer Quality & CI/CD Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (or newer LTS)
- **Package Manager**: `npm`

### 2. Getting Started Locally

Install dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server |
| `npm run lint` | Runs ESLint checks across codebase |
| `npm run typecheck` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run test` | Runs the test suite via Vitest |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts production server locally |

---

## Continuous Integration (CI)

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on:
- **Pushes** to the `main` branch
- **Pull Requests** targeting `main`

### Pipeline Jobs:
1. **`lint`**: Validates code conventions and ESLint rules.
2. **`typecheck`**: Verifies TypeScript compiler types without emit.
3. **`test`**: Runs component and unit tests using Vitest and React Testing Library.
4. **`build`**: Validates that the application compiles into a production-ready artifact (runs after `lint`, `typecheck`, and `test` pass).

---

## Continuous Deployment (CD) Prerequisites

Before continuous deployment can be activated:
1. **Deployment Provider Selection**: Choose a target hosting platform (e.g., Vercel, AWS Amplify, Cloudflare Pages, or Docker container).
2. **Repository Secrets Configuration**: If using Vercel or AWS, configure the required access tokens and project IDs in GitHub repository secrets:
   - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (if deploying to Vercel)
3. **Production Environment Variables**: Populate any required API endpoints or database connections in your deployment dashboard matching `.env.example`.
