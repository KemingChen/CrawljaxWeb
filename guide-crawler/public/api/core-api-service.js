(function () {
    'use strict';

    angular.module('api').factory('CoreApiService', CoreApiService);

    CoreApiService.$inject = ['coreApi'];

    function CoreApiService(coreApi) {
        var service = {};

        service.getConfigurations = getConfigurations;
        service.getConfiguration = getConfiguration;
        service.getRecords = getRecords;
        service.getRecord = getRecord;

        return service;
        //////////

        function getConfigurations() {
            return coreApi('configurations', {}).getArray().$promise;
        }

        function getConfiguration(configId) {
            return coreApi('configurations/' + configId, {}).get().$promise;
        }

        function getRecords() {
            return coreApi('records', {}).getArray().$promise;
        }

        function getRecord(recordId) {
            return coreApi('records/' + recordId, {}).get().$promise;
        }
    }
})();