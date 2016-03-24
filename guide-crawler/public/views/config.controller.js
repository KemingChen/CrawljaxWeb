(function () {
    'use strict';

    angular.module('app.views').controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$stateParams', 'CoreApiService', '$scope', '$localStorage'];

    function ConfigCtrl($stateParams, CoreApiService, $scope, $localStorage) {
        var vm = this;

        var MESSAGE = {
            Processing: 'Processing Record ...',
            Parsing: 'Crawljax Parsing ...'
        };

        vm.configId = $stateParams.configId;
        vm.show = show;
        vm.run = run;

        vm.selected = undefined;

        vm.hideNoInputsState = false;
        vm.addDataSet = addDataSet;
        vm.deleteDataSet = deleteDataSet;
        vm.choseDataSet = choseDataSet;

        activate();

        //////

        function init() {
            vm.record = undefined;
            vm.isProcessing = true;
            vm.noInputs = true;
        }

        function getDataSetFromCache(configId) {
            if (!$localStorage.config)
                $localStorage.config = {};
            if (!$localStorage.config[configId])
                $localStorage.config[configId] = {};
            return $localStorage.config[configId];
        }

        function activate() {
            init();

            CoreApiService.getConfiguration(vm.configId).then(function (configuration) {
                vm.config = configuration;
                vm.dataSets = getDataSetFromCache(vm.configId);
                var key = Object.keys(vm.dataSets)[0];
                if (key) {
                    vm.selected = vm.dataSets[key];
                    processingRecord();
                }
            });

            $scope.$on('CrawljaxSocket', function (event, args) {
                var key = args["key"];
                var content = args["content"];

                if (key == 'success') {
                    processingRecord();
                }
            });
        }

        function processingRecord() {
            vm.record = undefined;
            vm.msg = MESSAGE.Processing;

            CoreApiService.getRecords().then(function (records) {
                records.forEach(function (record) {
                    if (!vm.record &&
                        record['configurationId'] == vm.configId &&
                        record.id == vm.selected.recordId) {

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

            CoreApiService.runConfiguration(vm.configId, vm.selected.formInputValues)
                .then(function (data) {
                    init();
                    vm.msg = MESSAGE.Parsing;
                    vm.selected.recordId = data;
                });
        }

        function addDataSet() {
            var person = prompt("給一個新名稱吧", "");
            if (person != null && person != "") {
                vm.dataSets[person] = {
                    name: person,
                    formInputValues: {},
                    recordId: undefined
                };
            }
        }

        function deleteDataSet() {

        }

        function choseDataSet(dataSet) {
            vm.selected = dataSet;
            processingRecord();
        }

        function show(state) {
            vm.state = state;
        }
    }
})();