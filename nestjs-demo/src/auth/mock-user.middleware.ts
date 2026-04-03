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
      roles: ['admin'],
    };

    next();
  }
}