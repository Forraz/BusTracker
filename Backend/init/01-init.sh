#!/bin/bash
set -e

psql \
  --username "$POSTGRES_USER" \
  --set=DATABASE_NAME="$DATABASE_NAME" \
  --file=/docker-entrypoint-initdb.d/02-create-db.sql
