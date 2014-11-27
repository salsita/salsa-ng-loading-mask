var express = require('express'),
  ejs = require('ejs'),
  app = express();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', './example');
app.use('/static', express.static('./'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/dummy', function(req, res) {
  var time = req.query.time;
  var delay = time ? time * 1000 : Math.random() * 10000;

  setTimeout(function() {
    res.sendStatus(200);
  }, delay);
});

app.listen(3000);