(function() {
  module.exports = apiRouter;

  function apiRouter(router) {
    router.get("/", function(req, res) {
      res.json({
        message: "hello world!"
      });
    });
    
    return router;
  }
})();
