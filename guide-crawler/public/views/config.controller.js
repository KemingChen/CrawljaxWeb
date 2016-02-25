(function () {
    'use strict';

    angular.module('app.views').controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$stateParams', 'CoreApiService', 'CrawljaxApiService'];

    function ConfigCtrl($stateParams, CoreApiService, CrawljaxApiService) {
        var vm = this;

        vm.configId = $stateParams.configId;
        vm.show = show;
        vm.run = run;

        activate();

        //////

        function activate() {
            CoreApiService.getConfiguration(vm.configId).then(function (configuration) {
                vm.config = configuration;
            });
            CoreApiService.getRecords().then(function (records) {
                records.forEach(function (record) {
                    if (!vm.record && record['configurationId'] == vm.configId) {
                        vm.record = record;
                        CoreApiService.getRecord(record.id).then(function (record) {
                            vm.record = record;
                            console.log(vm.record);
                        });
                    }
                });
            })
        }

        function run() {
            CrawljaxApiService.runConfiguration(vm.configId);
        }

        function show(state) {
            vm.state = {};
            vm.state.snapshot = "snapshot";
            vm.state.inputs = [1, 2, 3, 4];
        }
    }
})();