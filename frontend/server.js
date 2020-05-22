const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8084;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tava:qwe123@cluster0-zihqv.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
var user_collection;

app.use(bodyParser.json());

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.post('/setHistory', function (req, res) {
  // req : { 'addr' : '~~', 'type' : '~~', 'amount' : '~~', 'timestamp' : '~~' }
  var username = 'user2' // 일단 우리는 테스트 유저를 user2로만 상정
  var txobj = { type: req.body.type, amount: req.body.amount, timestamp: req.body.timestamp };
  
  //console.log("setHistory requested");
  //console.log(req.body);

  const user_collection = client.db("txs").collection(username);
  user_collection.insertOne(txobj, function(err, result) {
    if (err) throw err;
    res.send(txobj); // echo the result back
  });
});

app.post('/getHistory', function (req, res) {
  // req : { 'addr' : '~~' }
  var username = 'user2' // 일단 우리는 테스트 유저를 user2로만 상정
  //console.log("getHistory requested");
  //console.log(req.body);

  const user_collection = client.db("txs").collection(username);
  user_collection.find().sort({ _id: -1}).limit(7).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, function () {
  client.connect(function(err) {
    if(err) throw err;
    console.log('Example app listening on port ' + port)
  });
});
