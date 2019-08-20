.DEFAULT_GOAL := dev
SERVER_OPTS ?= --baseURL=/ --appendPort=false
DEPS := node_modules

.PHONY: dev
dev: $(DEPS)
	hugo server -D -F --disableFastRender --bind=0.0.0.0 $(SERVER_OPTS)

node_modules: package.json
	npm install

.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: deps
deps:
	brew reinstall node
	brew reinstall hugo

.PHONY: build
build: $(DEPS)
	hugo --gc --minify

.PHONY: publish
publish:
	@echo "done by netlify"

.PHONY: netlify-dev
netlify-dev:
	netlify dev -c 'make dev'
