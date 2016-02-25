(function () {
    var self = this;

    self.config = require('../config');
    module.exports = installConfigurationsApi;

    function installConfigurationsApi(router) {
        router.route('/configurations').get(getConfigurations);
        router.route('/configurations/:configId').get(getConfiguration);
    }

    function getConfigurations(req, res) {
        var result = [];
        var configurations = self.config.CONFIGURATIONS_PATH.getDirSync();
        configurations.forEach(function (filename, index) {
            if (filename.match('\\.json$')) {
                var content = self.config.CONFIGURATIONS_PATH.getFileSync(filename);
                result.push(JSON.parse(content));
            }
        });
        res.json(result);
    }

    function getConfiguration(req, res) {
        var filename = req.params.configId + ".json";
        var content = self.config.CONFIGURATIONS_PATH.getFileSync(filename);
        res.json(JSON.parse(content));
    }
})();
