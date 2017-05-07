(function (angular) {
    'use strict';

    function index($scope) {
        var $ctrl = this;
        componentHandler.upgradeAllRegistered();
        $ctrl.notes = [];

        function getUser(callback) {
            firebase.database().ref('/user/').orderByChild('uid').equalTo(localStorage.getItem('user')).once('value').then(function (snapshot) {
                if (snapshot.val() !== null) {
                    snapshot.forEach((child) => {
                        return callback(child);
                    });
                } else {
                    return callback("");
                }
            });
        }

        this.$routerOnActivate = function () {
            getUser(function (user) {
                var commentsRef = firebase.database().ref('/notes/').orderByChild('userId').equalTo(user.key);

                commentsRef.on('child_added', function (data) {
                    $ctrl.notes.unshift(data.val());
                    console.log(data.val());
                    $scope.$apply();
                });

                commentsRef.on('child_changed', function (data) {
                    console.log(data.val());
                });

                commentsRef.on('child_removed', function (data) {
                    console.log(data.val());
                });
            });
        }
    }

    angular.module('index', ['newnote'])
        .component('index', {
            templateUrl: 'app/dashboard/components/index/index.html',
            bindings: {
                $router: '<'
            },
            controller: index
        });
})(window.angular);