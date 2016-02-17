(function () {
    'use strict';

    angular.module('app.content').controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$stateParams', 'CoreApiService', 'CrawljaxApiService'];

    function ConfigCtrl($stateParams, CoreApiService, CrawljaxApiService) {
        var vm = this;

        vm.configId = $stateParams.configId;
        vm.config = $stateParams.config;
        vm.run = run;

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

        function run() {
            CrawljaxApiService.runConfiguration(vm.configId).then(function () {

            });
        }
    }
})();