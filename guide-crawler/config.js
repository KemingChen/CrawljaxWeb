(function() {
  var self = this;

  self.path = require('path');
  module.exports = {
    CONFIGURATIONS_PATH: combineRootPath('../out/configurations'),
    RECORDS_PATH: combineRootPath('../out/crawl-records'),
  }

  function combineRootPath(path) {
    return self.path.join(process.env.PWD, path);
  }
})();
