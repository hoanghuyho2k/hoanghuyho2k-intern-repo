
# CI/CD and Pull Request Guidelines

## Purpose of CI/CD

CI/CD automates development tasks such as installing dependencies, running tests, linting, building, and deploying. Automated checks validate code consistently before merge or release, improving reliability and reducing manual errors.

## Automating style and spell checks

Automate style and spelling checks (ESLint, Prettier, markdownlint, cspell or repo spellcheck action) to enforce consistent formatting and catch documentation issues early.

Recommended local commands

- npm test
- npm run lint
- npm run format
- npx markdownlint-cli2 "**/*.md"
- npx cspell "**/*.{md,js,ts,json}"

## Common CI/CD challenges

- Strict checks can block progress; configure rules to balance quality and velocity.
- Tool configuration must match project needs to reduce false positives.
- CI runtime and resource limits may require splitting jobs, caching dependencies, or using job matrix.

## How CI/CD pipelines differ by team size

- Small projects: simple pipeline (install, lint, test).
- Large teams: multi-stage pipeline (lint, unit tests, integration tests, security scans, build, deploy).

## Push & pull request checklist (for this repo)

- Run tests locally: npm test or yarn test
- Run linter and formatter: npm run lint and npm run format
- Run markdownlint and spell check locally: npx markdownlint-cli2 and npx cspell (or repo-equivalent)
- Add or update unit tests for changed behavior
- Rebase or merge main to resolve conflicts before push
- Create a descriptive PR title and body
  - Include what changed and why
  - Link related issues
  - List manual testing steps if needed
- Ensure CI passes (lint, tests, build) before merging
- Use squash merge or clean commit history per repository convention
