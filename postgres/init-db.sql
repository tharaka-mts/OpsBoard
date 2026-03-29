-- Automated Database Initialization for OpsBoard
-- This script runs on the first startup/volume creation of the Postgres container.

-- 1. Grant permissions to the user for the public schema (Postgres 15+ requirement)
GRANT ALL ON SCHEMA public TO opsboarduser;
ALTER SCHEMA public OWNER TO opsboarduser;

-- 2. Create the work_items table
CREATE TABLE IF NOT EXISTS work_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    environment VARCHAR(50) NOT NULL,
    due_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Note: Ensure the database 'opsboard' is created via the POSTGRES_DB environment variable.
