(function (angular) {
    'use strict';

    function index($scope) {
        var $ctrl = this;
        componentHandler.upgradeAllRegistered();


        this.$routerOnActivate = function () {
            var currentUser = firebase.auth().currentUser;
            console.log(currentUser);
        }
    }

    angular.module('index', [])
        .component('index', {
            templateUrl: 'app/dashboard/components/index/index.html',
            bindings: {
                $router: '<'
            },
            controller: index
        });
})(window.angular);