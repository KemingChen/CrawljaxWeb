(function () {
    'use strict';

    angular.module('api', [
        'ngResource'
    ])
        .constant("coreEndPoint", "http://127.0.0.1:8000/api/")
        .constant("crawljaxEndPoint", "http://127.0.0.1:8080/")
        .factory("interceptor", interceptor)
        .factory("coreApi", coreApi)
        .factory("crawljaxApi", crawljaxApi);

    ////////
    coreApi.$inject = ['$resource', 'coreEndPoint', 'interceptor'];
    function coreApi($resource, coreEndPoint, interceptor) {
        return function (url, params) {
            var apiUrl = coreEndPoint + url;
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

    crawljaxApi.$inject = ['$resource', 'crawljaxEndPoint', 'interceptor'];
    function crawljaxApi($resource, crawljaxEndPoint, interceptor) {
        return function (url, params) {
            var apiUrl = crawljaxEndPoint + url;
            return $resource(apiUrl, params, {
                get: {
                    method: 'GET',
                    interceptor: interceptor
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