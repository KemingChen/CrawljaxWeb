(function () {
    var self = this;

    self.config = require('../config');
    self.fs = require('fs');
    module.exports = installConfigurationsApi;

    function installConfigurationsApi(router) {
        router.route('/configurations').get(getConfigurations);
        router.route('/configurations/:configId').get(getConfiguration);
    }

    function getConfigurations(req, res) {
        var result = [];
        var configurations = self.fs.readdirSync(self.config.CONFIGURATIONS_PATH);
        configurations.forEach(function (filename, index) {
            if (filename.match('\\.json$')) {
                var filePath = self.path.join(self.config.CONFIGURATIONS_PATH, filename);
                var content = self.fs.readFileSync(filePath, 'utf8');
                result.push(JSON.parse(content));
            }
        });
        res.json(result);
    }

    function getConfiguration(req, res) {
        var filename = req.params.configId + ".json";
        var filePath = self.path.join(self.config.CONFIGURATIONS_PATH, filename);
        var content = self.fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(content));
    }
})();
