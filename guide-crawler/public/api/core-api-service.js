(function () {
    'use strict';

    angular.module('api').factory('CoreApiService', CoreApiService);

    CoreApiService.$inject = ['coreApi'];

    function CoreApiService(coreApi) {
        var service = {};

        service.getConfigurations = getConfigurations;

        return service;
        //////////

        function getConfigurations() {
            return coreApi('configurations', {}).getArray().$promise;
        }
    }
})();