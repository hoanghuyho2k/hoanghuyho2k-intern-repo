# CI/CD and Pull Request Guidelines

## Purpose of CI/CD

CI/CD helps automate development tasks such as installing dependencies, running tests, linting, building, and deploying. Automated checks ensure code is validated consistently before it is merged or released, improving reliability and reducing manual errors.

## Automating Style and Spell Checks

Automating style and spell checks (via ESLint, Prettier, markdownlint, and spellcheck actions) improves project quality by enforcing consistent formatting and catching documentation issues early.

## Common CI/CD Challenges

- Strict checks can block progress for small issues; configure rules to balance quality and developer velocity.
- Tool configuration must match project needs to reduce false positives.
- CI runtime and resource limits may require splitting jobs or caching dependencies.

## How CI/CD pipelines differ by team size

- Small projects: simple pipelines (install, lint, test).
- Large teams: multi-stage pipelines (lint, unit tests, integration tests, security scans, build, deploy).

## Push & Pull Request Checklist (for this repo)

- Run tests locally: npm test or yarn test
- Run linter and formatter: npm run lint and npm run format
- Run markdownlint and spell check locally if configured
- Add or update unit tests for changed behavior
- Rebase or merge main to resolve conflicts before push
- Create a descriptive PR title and body
  - Include what changed and why
  - Link related issues
  - List manual testing steps if needed
- Ensure CI passes (lint, tests, build) before merging
- Use squash merge or clean commit history per repository convention