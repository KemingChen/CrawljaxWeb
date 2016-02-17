(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'api',
        'app.content'
    ])
        .config(config);

    ///////
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('Manage', {
                url: '/',
                views: {
                    'nav': {
                        templateUrl: './views/nav/nav.html',
                        controller: 'NavigationCtrl as ctrl'
                    }
                }
            });
    }
})();
