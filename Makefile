install:
	npm install

start:
	npx babel-node src/bin/gendiff.js

test: 
	npx jest

publish:
	npm publish

lint:
	npx eslint .