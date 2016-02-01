(function() {
  var self = this;

  module.exports = apiRouter;

  function apiRouter(router) {
    router.use(loggerMiddleware);
    
    console.log('\n-----');
    loadApiModule(router, './api-configurations');
    loadApiModule(router, './api-records');
    console.log('\n-----');

    return router;
  }

  function loadApiModule(router, modulePath) {
    var installApi = require(modulePath);

    console.log(installApi.name);
    installApi(router);
  }

  function loggerMiddleware(req, res, next) {
    console.log(req.method, req.originalUrl);
    next();
  }
})();
