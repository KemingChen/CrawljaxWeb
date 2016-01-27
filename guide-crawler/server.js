var express = require('express');
var app = express();
var route = require('./routes')(express);

app.get('/', function(req, res){
	res.redirect('/app/index.html');
});
app.use('/app', express.static('public'));
app.use('/api', route.api);

var server = app.listen(8000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Guild Crawler App Listening at http://%s:%s", host, port);
});
