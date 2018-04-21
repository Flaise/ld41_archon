./node_modules/.bin/browserify ./src/main.js --outfile ./dist/js.js --debug
cp ./src/html.html ./dist/index.html
cp -r ./src/assets ./dist
