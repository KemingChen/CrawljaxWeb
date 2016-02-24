(function () {
    'use strict';

    angular.module('app.views').controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$stateParams', 'CoreApiService', 'CrawljaxApiService'];

    function ConfigCtrl($stateParams, CoreApiService, CrawljaxApiService) {
        var vm = this;

        vm.configId = $stateParams.configId;
        vm.config = {};
        vm.run = run;

        activate();

        //////

        function activate() {
            CoreApiService.getConfiguration(vm.configId).then(function (configuration) {
                vm.config = configuration;
            });
        }

        function run() {
            CrawljaxApiService.runConfiguration(vm.configId).then(function () {

            });
        }
    }
})();