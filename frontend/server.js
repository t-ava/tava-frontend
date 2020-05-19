const express = require('express')
const app = express()
const port = 8084

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})
