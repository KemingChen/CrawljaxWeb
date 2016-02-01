(function() {
  var self = this;

  module.exports = apiRouter;

  function apiRouter(router) {
    router.use(loggerMiddleware);
    require('./api-configurations')(router);

    return router;
  }

  function loggerMiddleware(req, res, next) {
    console.log(req.method, req.originalUrl);
    next();
  }
})();
