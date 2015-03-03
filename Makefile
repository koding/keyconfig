BIN=./node_modules/.bin
SRC=$(shell find lib -name "*.coffee")
TARGETS=$(patsubst %.coffee,build/%.js,$(SRC))

all: test build

test:
	@$(BIN)/mocha \
		--require should \
		--reporter spec \
		--compilers coffee:coffee-script/register \
		--bail

build: clean $(TARGETS)

build/%.js: %.coffee
	@mkdir -p $(@D)
	@$(BIN)/coffee -p -b $< >$@

clean:
	@rm -fr build

.PHONY: test