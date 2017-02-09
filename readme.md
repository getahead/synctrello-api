# PREPARING
Firstly install [node.js](nodejs.org) or update it to v7
 
```sh
$ npm cache clean -f
$ npm install -g n
$ n stable
```
and [yarn](yarnpkg.com)
```sh
$ brew update
$ brew install yarn
```
Run yarn in project directory. Yarn is a better alternative to npm
```sh
$ yarn
```

### Start Developing

You need [nodemon](http://nodemon.io/) installed globally for fast restarting the server
```sh
$ npm install -g nodemon
```
and run it
```sh
$ npm nodemon src
```

### Production
```sh
$ pm2 start processes.json
```

### Deployment script
```sh
$ sh deploy.sh [-sf]
```
