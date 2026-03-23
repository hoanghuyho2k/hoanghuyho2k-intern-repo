
# Using Docker for NestJS Development

## Dockerfile for a NestJS Application

A `Dockerfile` defines how to build a container image for an application. For a NestJS app, it usually specifies:

- the base Node.js image
- the working directory
- dependency installation
- copying source files
- building the app
- the command used to start the server

Example:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

A Dockerfile like this packages the NestJS application so it can run consistently in different environments. Docker’s docs describe image builds as packaging software to run it locally or in the cloud, and recommend multi-stage builds for smaller final images.

## Multi-Stage Builds

A multi-stage build uses more than one FROM statement. One stage is used to build the app, and another stage is used to run only the final compiled output.

Benefits of multi-stage builds:

smaller final image
fewer unnecessary files in production
reduced attack surface
cleaner separation between build and runtime environments

Docker’s official docs explain that multi-stage builds let you copy only the artifacts you need into the final image, leaving build dependencies behind.

Running NestJS with PostgreSQL in Docker Compose

Docker Compose can run both the NestJS API and PostgreSQL together.

`docker-compose.yml`

```yaml
services:
  api:
    build:
      context: ./nestjs-demo
      dockerfile: Dockerfile
    container_name: focusbear-nestjs
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
      DATABASE_NAME: focusbear_dev
    depends_on:
      - postgres
  postgres:
    image: postgres:17
    container_name: focusbear-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: focusbear_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Docker Compose is designed for defining and running multi-container applications in one YAML file, which makes it useful for backend stacks that depend on more than one service. Docker’s Compose docs also highlight using health checks and logs to debug multi-service setups.

## Testing the Setup

To start both containers:

```bash
docker compose up -d
```

To check running containers:

```bash
docker ps
```

To test the API:

```bash
curl <http://localhost:3000>
```

If the NestJS app is configured correctly, it should respond on port `3000`, while PostgreSQL runs on port `5432`.

## Logs and Debugging

To view API logs:

```bash
docker compose logs api
```

To follow logs in real time:

```bash
docker compose logs -f api
```

To enter the running API container:

```bash
docker exec -it focusbear-nestjs sh
```

Docker’s docs show `docker compose logs` for streaming output from services, and Nest’s docs note that NestJS has a built-in logger during application startup and exception handling, which makes container logs useful for debugging.

## Reflection

How does a Dockerfile define a containerized NestJS application?

A Dockerfile defines the base image, dependencies, source code, build steps, exposed ports, and startup command needed to run the NestJS app inside a container.

What is the purpose of a multi-stage build in Docker?

A multi-stage build separates the build environment from the runtime environment, producing a smaller and cleaner final image by copying only the necessary output.

How does Docker Compose simplify running multiple services together?

Docker Compose allows multiple services such as a NestJS API and PostgreSQL database to be defined in one file and started together with a single command.

How can you expose API logs and debug a running container?

You can use docker compose logs or docker logs to view API output, and docker exec -it to enter the container and inspect files, environment variables, or processes.
