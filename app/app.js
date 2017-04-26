(function (angular) {
    'use strict';

    angular.module('app', ['ngComponentRouter', 'index', 'notes'])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .value('$routerRootComponent', 'app')
    .component('app', {
        template: '<ng-outlet></ng-outlet>',
        bindings: { $router: '<' },
        $routeConfig: [
           { path: "/", name: "Index", component: "index", useAsDefault: true },
            { path: "/:id", name: "Notes", component: "notes"}
        ]
    });
})(window.angular);