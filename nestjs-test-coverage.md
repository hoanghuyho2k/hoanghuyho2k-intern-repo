
# Understanding the Focus Bear Coverage Bar and Writing Meaningful Tests

## Jest coverage in NestJS

NestJS uses Jest as its default testing framework, and Jest can generate a code coverage report showing how much of the codebase is exercised by tests. Jest’s coverage system can report percentages for statements, branches, functions, and lines, and coverage can be collected with the `--coverage` flag or the `collectCoverage` configuration option.

Command:

```bash
npm test -- --coverage
```

This generates a summary in the terminal and usually creates a `coverage/` folder with more detailed reports. Jest documents `--coverage` and coverageDirectory as the main way to collect and output these reports.

What the coverage bar tracks

The coverage bar tracks how much of the code is exercised by tests. In practice, it commonly reflects:

`Statements`: how many executable statements were run
`Branches`: how many decision paths were tested
`Functions`: how many functions were called by tests
`Lines`: how many lines were executed

Jest’s coverage configuration and threshold support are based on these metrics.

Test output:

```bash
tasks.service.ts |   52.17 |       60 |   28.57 |   47.61 | 22-58
```

The initial report showed that tasks.service.ts had low coverage because only findAll() was tested. I improved the coverage by adding tests for:

findOne()
create()
update()
remove()
addBackgroundTask()

I also strengthened assertions by checking exact returned values and verifying mock calls with the correct arguments.

Weak assertion: 

```typescript
expect(result).toBeDefined();
```

Strong assertion:

```typescript
expect(result).toEqual([{ id: 1, title: 'DB task' }]);
```

This improved both the test quality and the coverage report because the tests now verify actual behavior instead of only checking that some value exists.

Strong assertion test output for tasks.service.spec.ts

```bash
tasks.service.ts |     100 |       80 |     100 |     100 | 12
```

## Reflection

What does the coverage bar track, and why is it important?

The coverage bar tracks how much of the codebase is exercised by tests, usually across statements, branches, functions, and lines. It is important because it helps identify untested areas and encourages broader testing coverage.

Why does Focus Bear enforce a minimum test coverage threshold?

A minimum threshold helps ensure that important parts of the backend are tested before code is deployed. This reduces the chance of regressions and encourages developers to maintain testing discipline as the codebase grows. Jest supports threshold enforcement directly through `coverageThreshold`.

How can high test coverage still lead to untested functionality?

High coverage can still miss real problems if tests only execute code without checking meaningful outcomes. For example, weak assertions may increase coverage numbers while failing to verify correct behavior.

What are examples of weak vs strong test assertions?

A weak assertion is `expect(result).toBeDefined()` because it does not verify content. A stronger assertion is `expect(result).toEqual(...)` because it checks the exact expected value.

How can you balance increasing coverage with writing effective tests?

You can balance both by targeting untested branches and edge cases while also writing strong assertions that verify actual behavior. The goal is not just to increase numbers, but to ensure tests genuinely protect the application.
