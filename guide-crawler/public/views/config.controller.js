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
                vm.formInputModel = {};
                vm.config['formInputValues'].forEach(function (input) {
                    vm.formInputModel[input.name] = input.value;
                });
            });
            CoreApiService.getRecords().then(function (records) {
                records.forEach(function (record) {
                    if (!vm.record && record['configurationId'] == vm.configId) {
                        vm.record = record;
                        CoreApiService.getRecord(record.id).then(function (record) {
                            vm.record = record;
                            var states = vm.record.result['states'];
                            for (var key in states) {
                                if (states.hasOwnProperty(key)) {
                                    var state = states[key];
                                    if (state.inputs.length > 0) {
                                        vm.state = state;
                                        break;
                                    }
                                }
                            }
                        });
                    }
                });
                if (!vm.record) {
                    vm.record = {
                        result: {}
                    };
                }
            })
        }

        function run() {
            console.log(vm.formInputModel);
            CoreApiService.runConfiguration(vm.configId, vm.formInputModel);
        }

        function show(state) {
            vm.state = state;
        }
    }
})();