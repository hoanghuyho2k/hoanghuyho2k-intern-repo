
# Security Best Practices in NestJS

## Common Security Risks in a NestJS Backend

Common security risks in a NestJS backend include injection attacks, insecure CORS configuration, missing rate limiting, weak authentication and authorization, leaked secrets, and unsafe error handling. NestJS runs on Express or Fastify, so many common web API risks still apply if security controls are not configured properly.

## Install packages

```bash
cd nestjs-demo
npm install @nestjs/platform-fastify @fastify/helmet @fastify/rate-limit
```

## Register Helmet and rate limiting in main.ts

For Fasify-based app:

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(helmet);
  await app.register(rateLimit, {
    max: 5,
    timeWindow: '1 minute',
  });

  await app.listen(3000);
}
bootstrap();
```

## Start the app

```bash
npm run start:dev
```

## Test Helmet (security headers)

```bash
curl -I http://localhost:3000/
```

Output showing Helmet is working:

```bash
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
content-type: application/json; charset=utf-8
content-length: 64
Date: Mon, 06 Apr 2026 02:09:06 GMT
Connection: keep-alive
Keep-Alive: timeout=72
```

## Test Rate Limiting

```bash
for i in {1..10}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tasks; done
```

Oupput of the test:

```bash
200
200
200
200
200
429
429
429
429
429
```

## Confirm exception handling still works

Trying an invalid route:

```bash
curl http://localhost:3000/does-not-exist
```

Output: 

```bash
{"message":"Cannot GET /does-not-exist","error":"Not Found","statusCode":404}%
```

## Confirm secrets are not commited

Make sure .env does not appear:

```bash
git status
```

## Reflection

What are the most common security vulnerabilities in a NestJS backend?

Common vulnerabilities include injection attacks, poor authentication or authorization, insecure CORS settings, missing rate limiting, and leaked secrets. These risks can affect any NestJS API if security controls are not configured properly.

How does @fastify/helmet improve application security?

`@fastify/helmet` improves security by setting HTTP headers that help protect against common web vulnerabilities, such as clickjacking and some unsafe content-loading behavior. NestJS documents Helmet as an important protection layer for HTTP apps.

Why is rate limiting important for preventing abuse?

Rate limiting helps prevent abuse by restricting how many requests a client can make in a period of time. This reduces the risk of brute-force attacks, spam requests, and unnecessary load on the server. NestJS’s rate-limiting guide presents it as a common protection against brute-force attacks.

How can sensitive configuration values be protected in a production environment?

Sensitive values should be protected by storing them in environment variables or managed secret systems, not in source code. NestJS supports this through `@nestjs/config`, which allows configuration to be loaded from the environment at runtime.
