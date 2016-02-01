(function () {
    'use strict';

    angular.module('app.index').controller('NavigationCtrl', NavigationCtrl);
    NavigationCtrl.$inject = ['Configurations'];

    function NavigationCtrl(Configurations) {
        var vm = this;

        activate();

        function activate() {
            Configurations.query(function (array) {
                vm.configurations = array;
            });
        }
    }
})();
