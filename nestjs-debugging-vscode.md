
# Debugging with VSCode and Breakpoints

## Create a launch.json file

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:dev"],
      "console": "integratedTerminal",
      "restart": true,
      "skipFiles": ["<node_internals>/**"]
    }
}
```

## Place breakpoints

In tasks.controller.ts

```typescript
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body.title);
  }
```

In tasks.service.ts

```typescript
  create(title: string) {
    const task = this.taskRepository.create({ title });
    return this.taskRepository.save(task);
  }
```

## Start Debugging

In VS Code:

open Run and Debug
choose Debug NestJS
click the green start button

## Trigger the endpoint:

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Debug task"}'
```

When the request reaches the breakpoint, VS Code pause.

## What to inspect

I Checked:

`body` in the controller
`title` in the service
returned `values`
call `stack`
watched `variables`

Output of the debugging:

```bash
[12:07:13.074] INFO (18726): request completed
    req: {
      "id": "req-2",
      "method": "POST",
      "url": "/tasks",
      "query": {},
      "headers": {
        "host": "localhost:3000",
        "user-agent": "curl/8.4.0",
        "accept": "*/*",
        "content-type": "application/json",
        "content-length": "22"
      },
      "remoteAddress": "::1",
      "remotePort": 60347
    }
    res: {
      "statusCode": 201,
      "headers": {
        "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        "cross-origin-opener-policy": "same-origin",
        "cross-origin-resource-policy": "same-origin",
        "origin-agent-cluster": "?1",
        "referrer-policy": "no-referrer",
        "strict-transport-security": "max-age=31536000; includeSubDomains",
        "x-content-type-options": "nosniff",
        "x-dns-prefetch-control": "off",
        "x-download-options": "noopen",
        "x-frame-options": "SAMEORIGIN",
        "x-permitted-cross-domain-policies": "none",
        "x-xss-protection": "0",
        "x-ratelimit-limit": 5,
        "x-ratelimit-remaining": 4,
        "x-ratelimit-reset": 60,
        "content-type": "application/json; charset=utf-8",
        "content-length": "29"
      }
    }
    responseTime: 32
```

## Reflection

How do breakpoints help in debugging compared to console logs?

Breakpoints are more powerful than console logs because they let you pause execution, inspect variables in real time, step through code line by line, and view the call stack. Console logs only show values that were manually printed and often require repeated code changes to investigate a problem.

What is the purpose of launch.json, and how does it configure debugging?

launch.json defines how VS Code should start or attach to a program for debugging. It configures things such as the runtime, startup command, arguments, restart behavior, and which files to skip while stepping through code.

How can you inspect request parameters and responses while debugging?

You can place breakpoints in controllers and services, then send a request to the API. When execution pauses, VS Code shows the current parameters, local variables, and intermediate values in the Variables and Debug Console views.

How can you debug background jobs that don’t run in a typical request-response cycle?

You can debug background jobs by placing breakpoints inside the job processor or worker code, then attaching the debugger while triggering the job. Since the code does not run through a controller, the breakpoint must be in the worker or queue-processing path instead.
