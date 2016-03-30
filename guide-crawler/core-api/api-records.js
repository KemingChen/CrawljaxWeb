(function () {
    var $ = require('../config');
    var webShot = require('webshot');
    var promise = require('promise');
    var jsDom = require('jsdom').jsdom;
    var path = require('path');

    module.exports = installRecordsApi;

    function installRecordsApi(router) {
        router.route('/records').get(getRecords);
        router.route('/records/:recordId').get(getRecord);
    }

    function getRecords(req, res) {
        var result = [];
        var recordsDir = $.records.getDir();

        recordsDir.forEach(function (dir) {
            var crawlJsonContent = $.records.getFile(dir + '/crawl.json');
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
        var json = JSON.parse($.records.getFile(parseFilePath));

        if (Object.keys(json).length > 0) {
            res.json(json);
            return;
        }

        json.crawl = JSON.parse($.records.getFile(recordId + '/crawl.json'));
        json.result = JSON.parse($.records.getFile(recordId + '/plugins/0/result.json'));
        json.config = JSON.parse($.records.getFile(recordId + '/plugins/0/config.json'));

        if (Object.keys(json.result).length > 0) {
            screenShotDOM(json.result, recordId).then(function () {
                $.records.writeFile(parseFilePath, JSON.stringify(json));
                res.json(json);
            });
        }
        else {
            res.json(json);
        }
    }

    function screenShotDOM(result, recordId) {
        return new promise(function (resolve, reject) {
            var domsDir = path.join(recordId, '/plugins/0/doms');
            var files = $.records.getDir(domsDir);

            console.log('processing:', recordId, ', found:', files.length, 'documents');
            if (files.length == 0) {
                resolve();
            }

            files.forEach(function (filename) {
                console.log('processing:', recordId, ', capture:', filename);
                var filePath = path.join(domsDir, filename);
                var content = $.records.getFile(filePath);

                var imagePath = path.join('./screenshot', recordId, filename.replace('.html', '.png'));
                var statusName = filename.split('.')[0];
                result['states'][statusName]['snapshot'] = imagePath;

                var output = path.join($.public.value, imagePath);
                var window = jsDom(content).defaultView;
                var jquery = require('jQuery')(window);

                result['states'][statusName]['inputs'] = [];
                jquery("textarea, input:not([type]), input[type=text], input[type=password]")
                    .each(function (index) {
                        var name = jquery(this).attr('name');
                        var id = jquery(this).attr('id');
                        var key = id ? id : name;
                        if (key) {
                            var inputIndex = index + 1;
                            result['states'][statusName]['inputs'].push({
                                index: inputIndex,
                                key: key,
                                type: jquery(this).prop('tagName'),
                                html: this.outerHTML
                            });
                            jquery(this).attr('placeholder', inputIndex);
                        }
                    });

                webShot(window.document.documentElement.outerHTML, output, {
                    siteType: 'html',
                    defaultWhiteBackground: true,
                    shotSize: {
                        width: 'window',
                        height: 'all'
                    },
                    customCSS: $.markInputsCSS
                }, function (err) {
                    err && console.log(err);
                    resolve();
                });
            });
        });
    }
})();
