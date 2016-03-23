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
        vm.hideNoInputsState = true;

        activate();

        //////

        function init() {
            vm.record = undefined;
            vm.isProcessing = true;
            vm.noInputs = true;
        }

        function activate() {
            init();

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
                                        vm.noInputs = false;
                                        break;
                                    }
                                }
                            }
                            vm.isProcessing = false;
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
            vm.isProcessing = true;

            CoreApiService.runConfiguration(vm.configId, vm.formInputModel).then(function () {
                init();
                vm.msg = message.parsing;
            });
        }

        function show(state) {
            vm.state = state;
        }
    }
})();