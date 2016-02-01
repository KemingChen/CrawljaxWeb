(function(){
    'use strict';
    app.controller('NavigationCtrl', NavigationCtrl);
    NavigationCtrl.$inject = [];

    function NavigationCtrl(){
        var vm = this;
        this.data = [{
            "name": "hello1"
        },{
            "name": "hello2"
        },{
            "name": "hello3"
        }];
    }
})();