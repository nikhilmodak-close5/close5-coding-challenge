var express = require('express');
var api = require('./lib/API');

var app = express();

app.use(express.static('assets'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/listing', function (req, res) {
  api.select(req.query, function (err, results) {
    if (err) {
      res.status(500).json({
        status: 500,
        message: 'Something went wrong!'
      });
    } else {
      res.json(results);
    }
  });
});

app.listen(8080, function () {
  console.log('Server running on port 8080!');
});