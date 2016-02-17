(function () {
    'use strict';

    angular.module('app.content').controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$stateParams', 'CoreApiService'];

    function ConfigCtrl($stateParams, CoreApiService) {
        var vm = this;

        vm.configId = $stateParams.configId;
        vm.config = $stateParams.config;

        activate();

        //////

        function activate() {
            if (!vm.config) {
                CoreApiService.getConfigurations().then(function (configurations) {
                    angular.forEach(configurations, function (configuration) {
                        if (configuration.id == vm.configId) {
                            vm.config = configuration;
                        }
                    });
                });
            }
        }
    }
})();