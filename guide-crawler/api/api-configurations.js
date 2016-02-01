(function() {
  var self = this;

  self.config = require('../config');
  self.fs = require('fs');
  module.exports = installConfigurationsApi;

  function installConfigurationsApi(router) {
    router.route('/configurations')
      .get(getConfigurations);
  }

  function getConfigurations(req, res) {
    var configurations = self.fs.readdirSync(self.config.CONFIGURATIONS_PATH);
    configurations.forEach(function(data, index) {
      configurations[index] = data.replace('.json', '');
    });
    res.json(configurations);
  }
})();
