#!/bin/sh

npx prisma migrate deploy
npx tsx ./scripts/populate-db.ts

tail -f /dev/null
