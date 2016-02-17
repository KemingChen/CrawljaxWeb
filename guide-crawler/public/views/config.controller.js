(function () {
    'use strict';

    angular.module('app.content').controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$stateParams'];

    function ConfigCtrl($stateParams) {
        var vm = this;

        vm.configName = $stateParams.configName;

        activate();

        //////

        function activate() {
            console.log(vm.configName);
        }
    }
})();