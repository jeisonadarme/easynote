(function (angular) {
    'use strict';

    angular.module('app', ['ngComponentRouter', 'login', 'dashboard'])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .value('$routerRootComponent', 'app')
    .component('app', {
        template: '<ng-outlet></ng-outlet>',
        bindings: { $router: '<' },
        $routeConfig: [
           { path: "/", name: "Login", component: "login", useAsDefault: true },           
           { path: "/dashboard/...", name: "Dashboard", component: "dashboard" },
           // { path: "/notes/:id", name: "Notes", component: "notes"}
        ]
    });
})(window.angular);