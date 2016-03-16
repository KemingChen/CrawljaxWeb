(function () {
    var self = this;

    self.config = require('../config');
    self.webshot = require('webshot');
    self.promise = require('promise');
    self.jsdom = require('jsdom').jsdom;
    self.path = require('path');

    module.exports = installRecordsApi;

    function installRecordsApi(router) {
        router.route('/records').get(getRecords);
        router.route('/records/:recordId').get(getRecord);
    }

    function getRecords(req, res) {
        var result = [];
        var recordsDir = self.config.records.getDirSync();

        recordsDir.forEach(function (dir) {
            var crawlJsonContent = self.config.records.getFileSync(dir + '/crawl.json');
            if (crawlJsonContent != "{}") {
                var crawl = JSON.parse(crawlJsonContent);
                if (crawl['crawlStatus'] === 'success')
                    result.push(JSON.parse(crawlJsonContent));
            }
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
        var recordId = req.params['recordId'];
        var parseFilePath = recordId + '/parse.json';
        var json = JSON.parse(self.config.records.getFileSync(parseFilePath));

        if (Object.keys(json).length > 0) {
            res.json(json);
            return;
        }

        json.crawl = JSON.parse(self.config.records.getFileSync(recordId + '/crawl.json'));
        json.result = JSON.parse(self.config.records.getFileSync(recordId + '/plugins/0/result.json'));
        json.config = JSON.parse(self.config.records.getFileSync(recordId + '/plugins/0/config.json'));

        if (Object.keys(json.result).length > 0) {
            screenShotDOM(json.result, recordId).then(function () {
                self.config.records.writeFileSync(parseFilePath, JSON.stringify(json));
                res.json(json);
            });
        }
        else {
            res.json(json);
        }
    }

    function screenShotDOM(result, recordId) {
        return new self.promise(function (resolve, reject) {
            var domsDir = self.path.join(recordId, '/plugins/0/doms');
            var files = self.config.records.getDirSync(domsDir);

            console.log('processing:', recordId, ', found:', files.length, 'documents');
            if (files.length == 0) {
                resolve();
            }

            files.forEach(function (filename) {
                console.log('processing:', recordId, ', capture:', filename);
                var filePath = self.path.join(domsDir, filename);
                var content = self.config.records.getFileSync(filePath);

                var imagePath = self.path.join('./screenshot', recordId, filename.replace('.html', '.png'));
                var statusName = filename.split('.')[0];
                result['states'][statusName]['snapshot'] = imagePath;

                var output = self.path.join(self.config.public.value, imagePath);
                var window = jsdom(content).defaultView;
                var $ = require('jQuery')(window);

                result['states'][statusName]['inputs'] = [];
                $("textarea, input:not([type]), input[type=text], input[type=password]")
                    .each(function (index) {
                        var name = $(this).attr('name');
                        var id = $(this).attr('id');
                        var key = id ? id : name;
                        if (key) {
                            var inputIndex = index + 1;
                            result['states'][statusName]['inputs'].push({
                                index: inputIndex,
                                key: key,
                                type: $(this).prop('tagName'),
                                html: this.outerHTML
                            });
                            $(this).attr('placeholder', inputIndex);
                        }
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
                    resolve();
                });
            });
        });
    }

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
})();
