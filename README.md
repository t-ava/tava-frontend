# :bike:Tava
## Tava-Frontend
![](images/preview.gif)
> Only *Ditibike* test available

### Overview
* `/index.html`: Main layout
* `/public/js/app.js`: Event handler methods for main logic
* `/public/js/txs.js`: Methods for interacting with AVA nodes
* `/public/js/googleauth.js`: Methods for google auth api
* `/public/js/utils.js`: Util functions
* `/public/src/citibike_stations.csv`: Citibike station data

### Setting Hardcoded Factors

* Set gecko node at [`txs.js`](https://github.com/t-ava/tava-frontend/blob/66a17e550e5ca30b5047898738a95dd6d5a34314/frontend/public/js/txs.js#L15).

```javascript
const NODE = 'http://satoshi.snu.ac.kr:9650/ext/bc/X';
```

* Set DNN-server at [`app.js`](https://github.com/t-ava/tava-frontend/blob/66a17e550e5ca30b5047898738a95dd6d5a34314/frontend/public/js/app.js#L17).

```javascript
const DNN_SERVER = 'http://satoshi.snu.ac.kr:8327/post';
```

### Getting Started
* Requirements : [nodeJS](https://nodejs.org/en/download/)

1. Install packages
```
npm install
```

2. Run server
```
node server.js
```
