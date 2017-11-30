# keema
Mastodon bot in foresdon.jp.

## install nvm and node.js v8.9.x
`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash`

`exit` and re-login again to apply the environment variable.

`nvm install lts/carbon`

## install keema
`git clone https://github.com/kedamaDQ/keema.git`

`cd keema`

`npm install`

`vi src/index.js`

change BASE\_URL.

`npm run transpile-es2015`

`node lib/index.js -d`
