(function () {
    'use strict';

    angular.module('app.api').factory('Configurations', ConfigurationsFactory);
    ConfigurationsFactory.$inject = ['$resource'];

    function ConfigurationsFactory($resource) {
        return $resource('/api/configurations', {});
    }
})();