FROM postgres:16-alpine

# Use the standard initialization directory for custom SQL scripts
COPY init-db.sql /docker-entrypoint-initdb.d/

# Set default permissions if needed
RUN chmod 644 /docker-entrypoint-initdb.d/init-db.sql

EXPOSE 5432
