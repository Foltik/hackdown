USE app;

CREATE DATABASE IF NOT EXISTS app;
CREATE USER IF NOT EXISTS app;
GRANT ALL ON DATABASE app TO app;

CREATE TABLE IF NOT EXISTS company (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    logo VARCHAR
);

CREATE TABLE IF NOT EXISTS review (
    id SERIAL PRIMARY KEY,
    company_id INT,
    source VARCHAR,
    sentiment REAL,
    body VARCHAR,
    date VARCHAR
);

CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    company_id INT,
    degrees VARCHAR,
    skills VARCHAR
);

CREATE TABLE IF NOT EXISTS test (
    company VARCHAR PRIMARY KEY,
    value VARCHAR
);
