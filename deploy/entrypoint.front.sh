#!/bin/sh

yarn db:generate
npx prisma migrate deploy
yes | npx tsx ./scripts/populate-db.ts

# Remove all editor features, keep only the static pages
rm -rf pages/editor components/editor/ hooks/useEditorContent.tsx scripts \
  && find pages/api -type f \
     -not -path "pages/api/images/\[id\].ts" \
     -exec rm -f {} \;

yarn build
yarn start