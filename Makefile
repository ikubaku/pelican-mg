# BEWARE ! Makefiles require the use of hard tabs

.PHONY: install check lint test

install:
	npm install -g csslint eslint eslint-config-strict eslint-plugin-filenames htmlhint htmllint-cli lighthouse
	pip install pre-commit
	pre-commit install

check: eslint
	pre-commit run --all-files

eslint:
	eslint templates/js/*.js

test:
	./test_ludochaordic.sh
