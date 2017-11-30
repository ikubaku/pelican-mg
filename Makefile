# BEWARE ! Makefiles require the use of hard tabs

NODE_BIN := node_modules/.bin

.PHONY: install check test

install:
	npm install csslint eslint eslint-config-strict eslint-plugin-filenames htmlhint htmllint-cli jscs
	pip install pre-commit
	pre-commit install

check:
	$(NODE_BIN)/eslint $(git ls-files [ grep '\.js$')
	$(NODE_BIN)/jscs $(git ls-files [ grep '\.js$')
	$(NODE_BIN)/csslint --ignore=order-alphabetical $(git ls-files [ grep '\.css$')
	pre-commit run --all-files

test:
	./test_ludochaordic.sh
