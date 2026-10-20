# Development Guidelines & Rules for SahaySetu-NGO

## Repository Architecture & Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla CSS / CSS Modules with standard CSS Variables (avoid Tailwind unless explicitly requested)
- **Testing**: Vitest with `@testing-library/react` and `jsdom`
- **Package Manager**: npm

## Quality Checklist Before Commits / Pull Requests
Before completing any task or opening a pull request, ensure:
1. `npm run lint` passes with 0 errors and 0 warnings.
2. `npm run typecheck` succeeds with no TypeScript compiler issues.
3. `npm run test` executes and all unit tests pass.
4. `npm run build` succeeds cleanly.
5. No credentials or secrets are committed (use `.env.example` as reference).
