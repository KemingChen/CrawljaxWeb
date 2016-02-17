(function () {
    'use strict';

    angular.module('api', [
        'ngResource'
    ])
        .constant("endPoint", "/api/")
        .factory("interceptor", interceptor)
        .factory("coreApi", coreApi);

    ////////
    coreApi.$inject = ['$resource', 'endPoint', 'interceptor'];
    function coreApi($resource, endPoint, interceptor) {
        return function (url, params) {
            var apiUrl = endPoint + url;
            return $resource(apiUrl, params, {
                get: {
                    method: 'GET',
                    interceptor: interceptor
                },
                getArray: {
                    method: 'GET',
                    interceptor: interceptor,
                    isArray: true
                },
                post: {
                    method: 'POST',
                    interceptor: interceptor
                }
            });
        };
    }

    interceptor.$inject = ['$q'];
    function interceptor($q) {
        var self = {};
        self.response = response;
        self.responseError = responseError;

        return self;

        ///////

        function response(res) {
            console.log("[Success]", res.config.url, res.data);
            return res.data;
        }

        function responseError(res) {
            console.log("[Error]", res.config.url, res);
            return $q.reject(res.data);
        }
    }
})();