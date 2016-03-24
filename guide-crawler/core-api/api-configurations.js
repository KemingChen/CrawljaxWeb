(function () {
    var config = require('../config');
    var requestPromise = require('request-promise');
    module.exports = installConfigurationsApi;

    function installConfigurationsApi(router) {
        router.route('/configurations').get(getConfigurations);
        router.route('/configurations/:configId').get(getConfiguration);
        router.route('/configurations/:configId/run').post(runConfiguration);
    }

    function getConfigurations(req, res) {
        var result = [];
        var configurations = config.configuration.getDirSync();
        configurations.forEach(function (filename) {
            if (filename.match('\\.json$')) {
                var content = config.configuration.getFileSync(filename);
                result.push(JSON.parse(content));
            }
        });
        res.json(result);
    }

    function getConfiguration(req, res) {
        var filename = req.params.configId + ".json";
        var content = config.configuration.getFileSync(filename);
        res.json(JSON.parse(content));
    }

    function runConfiguration(req, res) {
        var configId = req.params.configId;
        var filename = configId + ".json";
        var content = config.configuration.getFileSync(filename);
        var configuration = JSON.parse(content);
        var values = req.body;
        configuration.formInputValues = [];

        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                configuration.formInputValues.push({
                    'name': key,
                    'value': values[key]
                })
            }
        }

        console.log('http://127.0.0.1:8080/rest/configurations/' + configId);
        console.log(JSON.stringify(configuration));
        requestPromise({
            method: 'PUT',
            uri: 'http://127.0.0.1:8080/rest/configurations/' + configId,
            json: configuration
        }).then(function () {
            requestPromise({
                method: 'POST',
                uri: 'http://127.0.0.1:8080/rest/history',
                body: configId
            }).then(function (data) {
                data = JSON.parse(data);
                console.log(data["id"]);
                res.json(data["id"]);
            }).catch(function (err) {
                res.json(err);
            });
        }).catch(function (err) {
            res.json(err);
        });
    }
})();
