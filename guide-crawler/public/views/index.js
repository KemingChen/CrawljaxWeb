(function () {
    'use strict';

    angular.module('app.views', [
        "ngStorage"
    ])
        .config(config);

    ////////
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('Manage.Config', {
                url: 'configuration/:configId',
                views: {
                    'content@': {
                        templateUrl: './views/config.html',
                        controller: 'ConfigCtrl as ctrl'
                    }
                }
            });
    }
})();
