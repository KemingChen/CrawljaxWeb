(function () {
    'use strict';

    angular.module('api').factory('CrawljaxApiService', CrawljaxApiService);

    CrawljaxApiService.$inject = ['crawljaxApi'];

    function CrawljaxApiService(crawljaxApi) {
        var service = {};

        service.runConfiguration = runConfiguration;

        return service;
        //////////

        function runConfiguration(configId) {
            return crawljaxApi('rest/history', {}).post("phpbb").$promise;
        }
    }
})();