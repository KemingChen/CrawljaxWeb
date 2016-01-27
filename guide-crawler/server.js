var express = require('express');
var app = express();
var route = require('./routes')(express);

app.get('/', function(req, res){
	res.redirect('/views/index.html');
});
app.use('/views', express.static('views'));
app.use('/api', route.api);

var server = app.listen(8000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Guild Crawler App Listening at http://%s:%s", host, port);
});
