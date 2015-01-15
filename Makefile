BIN=./node_modules/.bin
EXPORT_NAME=keyconfig

test:
	@/Users/onur/.nvm/v0.10.32/bin/npm test 

bundle:
	@$(BIN)/browserify index.js -u underscore --bare \
	| sed -e "s/var _ = require('underscore');//" \
	| sed -e "s/window\.keyconfig/window.$(EXPORT_NAME)/" \
	| $(BIN)/bundle-collapser \
	> keyconfig.js
	@$(BIN)/uglifyjs keyconfig.js \
		--mangle -c hoist_vars=true,if_return=true \
		-o keyconfig.min.js \
		--source-map keyconfig.min.map --source-map-include-sources
	@mkdir -p dist
	@mv keyconfig.* dist

.PHONY: test
