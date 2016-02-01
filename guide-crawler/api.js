(function() {
    module.exports = apiService;

    function apiService(router) {
        router.get("/", function(req, res) {
            res.json({
                message: "hello world!"
            });
        });
        return router;
    }
})();
