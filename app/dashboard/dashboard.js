(function (angular) {
    'use strict';

    function layout($scope, $location) {

       var $ctrl = this;

        $ctrl.logOut = function () {
            var user = firebase.auth().currentUser;

            localStorage.setItem('user', null);
            $location.path('/');
        }
    }

    angular.module('dashboard', ['index', 'userinfo', 'search'])
        .component('dashboard', {
            templateUrl: 'app/dashboard/common/layout.html',
            $routeConfig: [
                { path: '/', name: 'Index', component: 'index', useAsDefault: true }
            ],
            $canActivate: function ($location) {
                var user = localStorage.getItem('user');
                if (user == "null" || user == null) {
                    $location.path('/');
                }
                else {
                    return true;
                }
            },
            controller: layout
        })
})(window.angular);