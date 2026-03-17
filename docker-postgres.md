
# Running PostgreSQL in Docker

## Running Postgre SQL in Docker

PostgreSQL can be run in Docker by using the official `postgres` image from Docker Hub. This makes it possible to start a database quickly without installing PostgreSQL directly on the host machine. Docker’s official Postgres image is designed for this exact use case, and Docker’s guides also show using Postgres for local development. :contentReference[oaicite:0]{index=0}

### Example `docker-compose.yml`

A simple Docker Compose setup for PostgreSQL can look like this:

```yaml
services:
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

Docker Compose is useful here because it can define services and volumes in one file and start them with a single command like docker compose up. Docker’s Compose docs describe it as a way to define and run multi-container applications, and Compose automatically creates named volumes if they do not already exist.

### Starting the Database

To start PostgreSQL:

```bash
docker compose up -d
```

To check the container is running:

```bash
docker ps
```

To view logs:

```bash
docker compose logs postgres
```

The docker compose up command starts the services defined in the Compose file, while docker compose logs lets you inspect service output for debugging.

### Connecting to PostgreSQL

A running PostgreSQL container can be accessed using a database client such as psql or pgAdmin.

Example using psql:

```bash
psql -h localhost -p 5432 -U postgres -d focusbear_dev
```

### Volumn and Data Persistence

Docker volumes are important because PostgreSQL stores its database files inside the container. If no named volume is mounted, recreating the container can result in data not being reused. Docker’s official Postgres image specifically notes that persistent database data should be mounted at `/var/lib/postgresql/data`, and Docker’s volume docs explain that named volumes are reused across restarts and later `docker compose up` runs.

With the Named Volumn:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

The database files are stored outside the container’s writable layer, so restarting or recreating the container does not remove the database contents unless the volume itself is deleted. Docker’s volume docs and Compose docs both describe this persistence behavior.

### Reflection

What are the benefits of running PostgreSQL in a Docker container?

Running PostgreSQL in Docker makes setup easier, keeps the development environment consistent, and avoids installing PostgreSQL directly on the local machine. It also makes it easier for a team to use the same database version and configuration.

How do Docker volumes help persist PostgreSQL data?

Docker volumes store PostgreSQL data outside the container itself, so the data remains available even if the container is restarted or recreated. Docker reuses named volumes across subsequent Compose runs unless they are explicitly removed.

How can you connect to a running PostgreSQL container?

We can connect to a running PostgreSQL container using a database client such as `psql` or pgAdmin by using the mapped port and database credentials, or by opening a shell inside the container with `docker exec`.
