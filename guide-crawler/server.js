(function () {
    var express = require('express');
    var path = require('path');
    var app = express();
    var api = require('./core-api')(express.Router());
    var publicFolder = path.join(__dirname, 'public');

    activate();

    function activate() {
        app.use('/api', api);
        app.use('/', express.static(publicFolder));
        app.get('*', function (req, res) {
            if (!path.extname(req.url.split("?")[0]))
                res.sendFile(path.join(publicFolder, '/index.html'));
            else
                res.status(404).send('Not found!!');
        });
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
