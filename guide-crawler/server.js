(function () {
    var self = this;

    self.express = require('express');
    self.app = express();
    self.api = require('./core-api')(express.Router());

    activate();

    function activate() {
        self.app.get('/', function (req, res) {
            res.redirect('/app');
        });
        self.app.use('/app', self.express.static('public'));
        self.app.use('/api', self.api);

        runServer(process.argv[2]);
    }

    function runServer(param) {
        var listen = (param || '127.0.0.1:8000').split(':');
        var host = listen[0];
        var port = listen[1];
        app.listen(port, host, function () {
            console.log('Guild Crawler App Listening at http://%s:%s', host, port);
        });
    }
})();
