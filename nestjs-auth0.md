
# Authentication in NestJS with Auth0 and JWT

## Auth0 and NestJS

Auth0 provides identity management so applications do not need to build username/password authentication from scratch. In an Auth0-based flow, the client application handles login with Auth0, receives tokens, and then sends an access token to the NestJS API. The API verifies that token before allowing access to protected routes. Auth0’s NestJS guidance describes authentication as starting on the client side, while authorization checks happen on the API side.

## How JWT authentication works

JWT stands for JSON Web Token. A JWT is sent by the client, usually in the `Authorization: Bearer <token>` header, and the API verifies the token signature and claims before trusting the request. NestJS’s authentication guide shows the general pattern of issuing or validating JWTs and then protecting routes with guards. Auth0’s JWT docs explain that tokens are signed using an algorithm such as RS256 or HS256.
## Role of JWT in API authentication

The JWT acts as proof that the user has already authenticated and has permission to call the API. With Auth0, the access token is what the NestJS backend validates for protected API requests. Auth0 also recommends RS256 because Auth0 signs the token with a private key while APIs verify it using the public key.

## How `jwks-rsa` works

`jwks-rsa` retrieves RSA public signing keys from a JWKS endpoint. Auth0 publishes a JSON Web Key Set that contains the public keys needed to verify JWTs signed with RS256. The API can look up the correct public key by the token’s `kid` value and use it to verify the signature. Auth0 documents that the JWKS contains the public keys for verifying Auth0-issued JWTs, and `jwks-rsa` exists specifically to retrieve those keys.

## How Auth0 handles authentication compared to username/password auth

With traditional authentication, the application is responsible for collecting passwords, storing them securely, and handling login flows. With Auth0, identity handling is delegated to an external identity provider, which reduces the amount of sensitive authentication logic the application must implement directly. The NestJS API then focuses on validating tokens and enforcing access rules rather than managing passwords itself. This is consistent with Auth0’s API security model and NestJS’s token-based authentication approach.

## Protecting an API route

In NestJS, a protected route is typically guarded by an authentication guard that validates the JWT and attaches the authenticated user information to the request. Then, additional guards can enforce roles or permissions if needed. NestJS documents guards as the standard way to allow or deny access to routes, and Auth0’s NestJS examples focus on validating access tokens before allowing protected endpoints.

## Install packages

```bash
npm install @nestjs/jwt jwks-rsa jsonwebtoken
```

## Add Auth0 values to .env

```bash
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=your-api-audience
```

## Create a simple JWT auth guard

```typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid!, (err, key) => {
    if (err) {
      callback(err, undefined);
      return;
    }

    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.replace('Bearer ', '');

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          audience: process.env.AUTH0_AUDIENCE,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ['RS256'],
        },
        (err, decoded) => {
          if (err) {
            reject(new UnauthorizedException('Invalid token'));
            return;
          }

          request.user = decoded;
          resolve(true);
        },
      );
    });
  }
}
```

## Update roles.guard.ts

```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Temporary mock user for testing
    request.user = {
      id: '123',
      email: 'admin@example.com',
      roles: ['user'],
    };

    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('No roles found for this user');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
```

## Update mock-user.middleware.ts

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(
    req: Request & { user?: { id: string; email: string; roles: string[] } },
    res: Response,
    next: NextFunction,
  ) {
    req.user = {
      id: '123',
      email: 'admin@example.com',
      roles: ['user'],
    };

    next();
  }
}
```

## Protect a route

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile() {
    return { message: 'Authenticated access granted' };
  }
}
```

## Test with a bearer token

```bash
curl http://localhost:3000/profile \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Testing

```bash
curl http://localhost:3000/admin
```

Output:

```bash
tonnuanhthu@Air-cua-Ton onboarding-backend-nest-js % curl http://localhost:3000/admin
{"message":"Admin access granted"}% 
```

## Change the middleware roles to user:

```typescript
roles: ['user']
```

Test again:

```bash
curl http://localhost:3000/admin
```

Result:

```bash
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "error": "Forbidden"
}
```

## Reflection

### How does Auth0 handle authentication compared to traditional username/password auth?

Auth0 centralizes identity management and token issuance, while traditional auth requires the application to handle password collection, storage, and verification itself. This reduces security responsibility in the application and makes it easier to support standard identity flows.

### What is the role of JWT in API authentication?

The JWT is the credential the client sends to the API to prove authentication. The API validates the signature and claims, then decides whether to allow access to the protected route.

### How do `jwks-rsa` and public/private key verification work in Auth0?

Auth0 signs tokens with its private key when using RS256, and the API verifies those tokens using the matching public key from Auth0’s JWKS endpoint. `jwks-rsa` helps retrieve the correct public key for verification.

### How would you protect an API route so that only authenticated users can access it?

I would validate the bearer token with a JWT-based auth guard, ensure the token is issued by the expected Auth0 tenant and audience, and only allow the request to proceed when the token passes verification. Additional role or permission checks could then be added with authorization guards.
