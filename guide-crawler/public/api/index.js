(function () {
    'use strict';

    angular.module('api', [
        'ngResource'
    ])
        .constant("coreEndPoint", "/api/")
        .constant("crawljaxSocketEndPoint", "ws://127.0.0.1:8080/socket")
        .factory("interceptor", interceptor)
        .factory("coreApi", coreApi)
        .service("crawljaxWebSocket", crawljaxWebSocket);

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

    crawljaxWebSocket.$inject = ['crawljaxSocketEndPoint', '$rootScope', '$timeout'];
    function crawljaxWebSocket(crawljaxSocketEndPoint, $rootScope, $timeout) {
        var service = this;

        service.activate = activate;

        /////////

        function activate() {
            service.socket = new WebSocket(crawljaxSocketEndPoint);
            service.socket.onmessage = onMessage;
            service.socket.onclose = onClose;
        }

        function onMessage(msg) {
            $timeout(function () {
                var array = msg.data.split('-');
                var key = array[0];
                array.shift();
                var content = array.join('-');
                console.log('[socket]', key, content);
                $rootScope.$broadcast('CrawljaxSocket', {
                    key: key,
                    content: content
                });
            });
        }

        function onClose() {
            activate();
        }
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