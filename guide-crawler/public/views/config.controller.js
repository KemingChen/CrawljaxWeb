(function () {
    'use strict';

    angular.module('app.views').controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$stateParams', 'CoreApiService', '$scope'];

    function ConfigCtrl($stateParams, CoreApiService, $scope) {
        var vm = this;

        var message = {
            processing: 'Processing Record ...',
            parsing: 'Crawljax Parsing ...'
        };

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

            $scope.$on('CrawljaxSocket', function (event, args) {
                var key = args.key;
                //var content = args.content;

                if (key == 'success') {
                    processingRecord();
                }
            });

            processingRecord();
        }

        function processingRecord() {
            vm.record = undefined;
            vm.msg = message.processing;

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
            });
        }

        function run() {
            console.log(vm.formInputModel);
            CoreApiService.runConfiguration(vm.configId, vm.formInputModel).then(function () {
                vm.record = undefined;
                vm.msg = message.parsing;
            });
        }

        function show(state) {
            vm.state = state;
        }
    }
})();