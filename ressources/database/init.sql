SELECT 'CREATE DATABASE poi_database' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sop_database')\gexec
GRANT ALL PRIVILEGES ON SCHEMA public TO sop_db_admin;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
