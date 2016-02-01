(function() {
  var self = this;

  self.config = require('../config');
  self.fs = require('fs');
  self.path = require('path')
  module.exports = installRecordsApi;

  function installRecordsApi(router) {
    router.route('/records')
      .get(getRecords);
  }

  function getRecords(req, res) {
    var result = [];
    var recordsDir = self.fs.readdirSync(self.config.RECORDS_PATH);

    recordsDir.forEach(function(dir) {
      var crawlJsonPath = self.path.join(self.config.RECORDS_PATH, dir, 'crawl.json');

      if (self.fs.existsSync(crawlJsonPath)) {
        var crawlJsonContent = self.fs.readFileSync(crawlJsonPath, 'utf8');
        result.push(JSON.parse(crawlJsonContent));
      }

    });

    res.json(result);
  }
})();
