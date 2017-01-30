BIN=./node_modules/.bin
SRC=$(shell find lib -name "*.coffee")
TARGETS=$(patsubst %.coffee,build/%.js,$(SRC))

all: test build

test:
	@$(BIN)/mocha \
		--reporter spec \
		--compilers coffee:coffee-script/register \
		--bail

test-watch:
	@$(BIN)/mocha \
		--reporter spec \
		--compilers coffee:coffee-script/register \
		--bail \
		--watch

build: clean $(TARGETS)

build/%.js: %.coffee
	@mkdir -p $(@D)
	@$(BIN)/coffee -p -b $< >$@

clean:
	@rm -fr build

.PHONY: test