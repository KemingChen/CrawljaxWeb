(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'api',
        'app.content'
    ])
        .config(config)
        .run(run);

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
