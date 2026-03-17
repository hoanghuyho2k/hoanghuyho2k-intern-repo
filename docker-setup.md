
# Docker Setup & Basic Usage

## Installing Docker & Docker Compose

Docker Desktop was installed on my machine, which includes both Docker and Docker Compose. This allows me to manage containers and multi-service applications easily.

To verify installation, I used:

```bash
docker --version
"Docker version 28.4.0, build d8eb465"
docker compose version
"Docker Compose version v2.39.2-desktop.1"
```

## Verifying Docker is Running

To check if Docker is running and view active containers:

```bash
docker ps
```

To see all containers (including stopped ones):

```bash
docker ps -a
```

## Key Docker Commands

Some important commands I learned:

`docker ps` → View running containers

`docker ps -a` → View all containers

`docker stop <container>` → Stop a running container

`docker start <container>` → Start a stopped container

`docker logs <container>` → View logs of a container

`docker rm <container>` → Remove a container

These commands are useful for managing and debugging backend services.

### Docker Compose

Docker Compose is used to run multiple containers together using a single configuration file (`docker-compose.yml`).

Instead of starting each service manually, I can run:

```bash
`docker compose up`
```

This will start all services (e.g., backend API, database, Redis) at once.

To stop all services:

```bash
`docker compose down`
```

## Reflection

What is the difference between docker run and docker-compose up?

`docker run` is used to start a single container manually, while `docker compose up` starts multiple containers defined in a configuration file.

How does Docker Compose help when working with multiple services?

Docker Compose allows multiple services (like API, database, and cache) to be defined and run together, making setup faster and more consistent.

What commands can you use to check logs from a running container?

The command `docker logs <container>` is used to view logs. With Docker Compose, `docker compose logs` can show logs for all services.

What happens when you restart a container? Does data persist?

Restarting a container does not guarantee data persistence unless volumes are used. Without volumes, data inside the container may be lost when it is removed.
