(function () {
    'use strict';

    angular.module('app.content').controller('NavigationCtrl', NavigationCtrl);

    NavigationCtrl.$inject = ['CoreApiService'];

    function NavigationCtrl(CoreApiService) {
        var vm = this;

        activate();

        function activate() {
            CoreApiService.getConfigurations().then(function (configurations) {
                vm.configurations = configurations;
            });
        }
    }
})();
