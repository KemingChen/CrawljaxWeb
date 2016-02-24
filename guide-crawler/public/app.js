(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'api',
        'app.views',
        'app.components'
    ])
        .config(config)
        .run(run);

    ///////
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true).hashPrefix("!");

        $stateProvider
            .state('Manage', {
                url: '/',
                views: {
                    'nav': {
                        templateUrl: './components/nav/nav.html',
                        controller: 'NavigationCtrl as ctrl'
                    },
                    'content': {
                        template: '請選取左邊的 Crawljax 設定檔'
                    }
                }
            });
    }

    run.$inject = ['crawljaxWebSocket'];
    function run(crawljaxWebSocket) {
        crawljaxWebSocket.activate();
    }
})();
