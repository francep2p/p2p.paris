.DEFAULT_GOAL := dev
SERVER_OPTS ?= --baseURL=/ --appendPort=false
LOCAL_BIN ?= /usr/local/bin
DEPS := node_modules $(LOCAL_BIN)/hugo

$(LOCAL_BIN)/npm: package.json
	brew reinstall node

node_modules: $(LOCAL_BIN)/npm
	npm install

$(LOCAL_BIN)/hugo:
	brew reinstall hugo

.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: dev
dev: $(DEPS)
	hugo server -D -F --disableFastRender --bind=0.0.0.0 $(SERVER_OPTS)

.PHONY: build
build: $(DEPS)
	hugo --gc --minify

.PHONY: publish
publish:
	@echo "done by netlify"

.PHONY: netlify-dev
netlify-dev:
	netlify dev -c 'make dev'