#!/bin/bash
docker-compose exec db cockroach sql --insecure < schema.sql
