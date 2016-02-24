(function () {
    'use strict';

    angular.module('api').factory('CoreApiService', CoreApiService);

    CoreApiService.$inject = ['coreApi'];

    function CoreApiService(coreApi) {
        var service = {};

        service.getConfigurations = getConfigurations;
        service.getConfiguration = getConfiguration;

        return service;
        //////////

        function getConfigurations() {
            return coreApi('configurations', {}).getArray().$promise;
        }

        function getConfiguration(configId) {
            return coreApi('configurations/' + configId, {}).get().$promise;
        }
    }
})();