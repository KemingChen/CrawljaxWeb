(function () {
    var self = this;

    self.config = require('../config');
    self.webshot = require('webshot');
    self.jsdom = require('jsdom').jsdom;
    self.path = require('path');

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

        var domFilenameArray = self.config.RECORDS_PATH.getDirSync(dir + '/plugins/0/doms');
        domFilenameArray.forEach(function (filename) {
            var content = self.config.RECORDS_PATH.getFileSync(dir + '/plugins/0/doms/' + filename);

            var imageFilename = self.path.join(dir, filename + ".png");
            result.result['states'][filename.split('.')[0]]['snapshot'] = './images/' + imageFilename;

            var output = self.path.join(self.config.IMAGE_PATH.value, imageFilename);
            var window = jsdom(content).defaultView;
            var $ = require('jQuery')(window);

            $("textarea, input:not([type]), input[type=text], input[type=password]")
                .each(function (index) {
                    $(this).attr('placeholder', (index + 1));
                });

            webshot(window.document.documentElement.outerHTML, output, {
                siteType: 'html',
                defaultWhiteBackground: true,
                shotSize: {
                    width: 'window',
                    height: 'all'
                },
                customCSS: getCustomCSS()
            }, function (err) {
                err && console.log(err);
            });
        });

        res.json(result);

        function getCustomCSS() {
            return '\
                textarea,\
                input:not([type]),\
                input[type=text],\
                input[type=password] {\
                    border: 3px solid red;\
                    font-size: 16px !important;\
                    margin-bottom: 1px !important;\
                }\
                textarea::-webkit-input-placeholder,\
                input:not([type])::-webkit-input-placeholder,\
                input[type=text]::-webkit-input-placeholder,\
                input[type=password]::-webkit-input-placeholder {\
                    color: red;\
                    font-weight: bolder;\
                }';
        }
    }
})();
