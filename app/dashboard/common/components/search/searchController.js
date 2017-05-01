(function (angular) {
    'use strict';

    function search() {
        var $ctrl = this;


    }

    angular.module('search', [])
        .component('search', {
            templateUrl: 'app/dashboard/common/components/search/search.html',
           
            controller: search
        });
})(window.angular);