
# Debugging and Managing Docker Containers

## Inspecting Running Containers

Docker provides several commands to inspect running containers and understand their current state.

To list running containers:

```bash
docker ps
```

To inspect detailed container information such as environment variables, ports, networks, and mounts:

```bash
docker inspect <container_name_or_id>
```

`docker ps` is useful for a quick overview, while `docker inspect` gives detailed JSON metadata about the container and how it is configured. Docker’s CLI docs describe `docker logs`, `docker exec`, and `docker attach` as core debugging tools for running containers.

### Checking logs

To check Logs from a Running Container:

```bash
docker logs <container_name_or_id>
```

To follow logs continuously:

```bash
docker logs -f <container_name_or_id>
```

With Docker Compose, logs for a service or all services can be viewed using:

```bash
docker compose logs
docker compose logs <service_name>
docker compose logs -f <service_name>
```

Docker documents that `docker logs` retrieves container output and that `--follow` continues streaming new log output.

### Entering a Running Container

To run a command or open a shell inside a running container:

``` bash
docker exec -it <container_name_or_id> sh
```

or, if Bash is available:

```bash
docker exec -it <container_name_or_id> bash
```

`docker exec` starts a new process inside the running container, which makes it useful for debugging and investigation. Docker notes that the command only runs while the main container process is still running.

### Managing Containers

To stop a running container:

```bash
docker stop <container_name_or_id>
```

To remove a container:

```bash
docker rm <container_name_or_id>
```

To restart a container:

```bash
docker restart <container_name_or_id>
```

For Docker compose setup:

```bash
docker compose down
docker compose up -d
```

Docker documents that docker compose up builds, creates, and starts services, while docker compose down stops and removes containers and networks created by Compose. By default, named volumes are not removed unless explicitly requested.

### Data Persistenece ans Volumes

Docker documents that docker compose up builds, creates, and starts services, while docker compose down stops and removes containers and networks created by Compose. By default, named volumes are not removed unless explicitly requested.

## Reflection

How can you check logs from a running container?

You can use `docker logs <container>` to view logs and `docker logs -f <container>` to follow logs in real time. In Docker Compose, `docker compose logs` shows logs for services.

What is the difference between `docker exec` and `docker attach`?

`docker exec` runs a new command or shell inside a running container, while `docker attach` connects your terminal directly to the main process already running in the container. `docker exec` is usually safer for debugging because it does not take over the container’s primary process.

How do you restart a container without losing data?

You restart the container with `docker restart` or `docker compose down && docker compose up -d`, and data persists as long as it is stored in a mounted volume rather than only in the container’s writable layer. Docker volumes are intended for persistent storage across restarts and container recreation.

How can you troubleshoot database connection issues inside a containerized NestJS app?

Start by checking whether both the NestJS app and PostgreSQL containers are running with `docker ps`, then inspect logs with `docker logs` or `docker compose logs`. Verify the database host, port, username, password, and database name, and make sure the app uses the correct hostname for its environment—for example, a Compose service name when both services are inside Docker, rather than `localhost`. You can also enter the app container with `docker exec -it` to inspect environment variables and test connectivity from inside the container.
