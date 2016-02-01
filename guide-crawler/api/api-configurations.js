(function() {
  module.exports = installConfigurationsApi;

  function installConfigurationsApi(router) {
    router.route('/configurations')
      .get(getConfigurations);
  }

  function getConfigurations(req, res) {
    res.send("some configurations");
  }
})();
