./node_modules/html-minifier/cli.js \
    --input-dir ./public \
    --output-dir ./public \
    --collapse-whitespace \
    --remove-comments \
    --minify-css \
    --process-scripts "[\"application/json\", \"application/ld+json\"]" \
    --file-ext html 