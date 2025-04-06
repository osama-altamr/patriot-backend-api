TYPEORM_CLI := 
TYPEORM_CONFIG := 
TYPEORM_CONFIG_TS := 

MIGRATIONS_DIR := 

BOOTSTRAP := 

# If you want to enable Node.js debugger, uncomment the following line:
# export RUN_OPTIONS=--inspect=0.0.0.0:9222

compile:
	rm -rf dist
	npx tsc -p ./tsconfig.build.json

install: package.json
	npm install
	npx husky install

run: compile
	node -r $(BOOTSTRAP) ${RUN_OPTIONS} ./dist/src/ | npx pino-pretty

develop:
	npx nodemon --watch src --ext ts --exec "make run"

.PHONY: compile
.PHONY: install
.PHONY: run
.PHONY: develop