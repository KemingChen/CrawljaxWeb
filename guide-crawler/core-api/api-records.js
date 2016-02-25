(function () {
    var self = this;

    self.config = require('../config');
    module.exports = installRecordsApi;

    function installRecordsApi(router) {
        router.route('/records').get(getRecords);
        router.route('/records/:recordId').get(getRecord);
    }

    function getRecords(req, res) {
        var result = [];
        var recordsDir = self.config.RECORDS_PATH.getDirSync();

        recordsDir.forEach(function (dir) {
            var crawlJsonContent = self.config.RECORDS_PATH.getFileSync(dir + '/crawl.json');
            if (crawlJsonContent != "{}")
                result.push(JSON.parse(crawlJsonContent));
        });

        result.sort(function (a, b) {
            if (a.id < b.id)
                return 1;
            else if (a.id > b.id)
                return -1;
            else
                return 0;
        });

        res.json(result);
    }

    function getRecord(req, res) {
        var dir = req.params['recordId'];
        var result = {};
        result.crawl = JSON.parse(self.config.RECORDS_PATH.getFileSync(dir + '/crawl.json'));
        result.result = JSON.parse(self.config.RECORDS_PATH.getFileSync(dir + '/plugins/0/result.json'));
        result.config = JSON.parse(self.config.RECORDS_PATH.getFileSync(dir + '/plugins/0/config.json'));

        res.json(result);
    }
})();
