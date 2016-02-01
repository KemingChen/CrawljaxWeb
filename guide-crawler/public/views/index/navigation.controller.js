(function () {
    'use strict';
    angular.module('app.index').controller('NavigationCtrl', NavigationCtrl);
    NavigationCtrl.$inject = [];

    function NavigationCtrl() {
        var vm = this;
        this.data = [{
            "name": "hello1"
        }, {
            "name": "hello2"
        }, {
            "name": "hello3"
        }];
    }
})();
