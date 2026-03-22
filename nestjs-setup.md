
# Setting Up a NestJS Project

To create a NestJS project, you first need to install the Nest CLI:

```bash
npm install -g @nestjs/cli
```

Then create a new project:

```bash
nest new nestjs-demo
```

Navigate into the project

```bash
cd nestjs-demo
```

Install dependencies:

```bash
npm install
```

Start the developer server:

```bash
npm run start:dev
```

By default, the app run at:

```bash
http://localhost:3000
```

## Default project structure

A typical NestJS project includes:

```bash
src/
  app.controller.ts
  app.service.ts
  app.module.ts
  main.ts
test/
node_modules/
package.json
tsconfig.json
```

Key files:

`main.ts` → Entry point of the application

`app.module.ts` → Root module that organizes the app

`app.controller.ts` → Handles incoming requests

`app.service.ts` → Contains business logic

### Understanding main.ts

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

`main.ts` is responsible for:

Creating the NestJS application

Loading the root module (`AppModule`)

Starting the server on a specific port

It acts as the starting point of the entire application.

### Understanding AppModule

```typescript
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`AppModule` is the root module of the application.

It:

Registers controllers and services

Organises application structure

Connects different parts of the app together

All other modules are typically imported into this root module.

### Testing a simple Endpoint

Default controller:

```typescript
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

Default service:

```typescript
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

When access to http://localhost:3000

We should see:

`Hello World!`

## Reflection

What files are included in a default NestJS project?

A default NestJS project includes main files such as `main.ts`, `app.module.ts`, `app.controller.ts`, and `app.service.ts`, along with configuration files and dependencies.

How does main.ts bootstrap a NestJS application?

`main.ts` creates the application using `NestFactory`, loads the root module, and starts the server by listening on a specified port.

What is the role of AppModule in the project?

`AppModule` acts as the root module that connects controllers, services, and other modules, serving as the central structure of the application.

How does NestJS structure help with scalability?

NestJS’s modular structure separates concerns into modules, controllers, and services, making it easier to manage, extend, and maintain large-scale applications.
