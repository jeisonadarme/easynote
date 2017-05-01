(function (angular) {
    'use strict';

    angular.module('dashboard', ['index', 'userinfo', 'search'])
        .component('dashboard', {
            templateUrl: 'app/dashboard/common/layout.html',
            $routeConfig: [
                { path: '/', name: 'Index', component: 'index', useAsDefault: true }
            ],
            $canActivate: function ($location) {
                var user = localStorage.getItem('user');
              
                console.log(user);
                if (user === null) {
                    $location.path('/');
                }
                else {
                    return true;
                }
            }
        })
})(window.angular);