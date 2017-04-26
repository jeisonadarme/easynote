(function(angular) {
    'use strict';

    function index($scope) {
        var $ctrl = this;
        var id;

        $ctrl.submit = function() {
          
            getRoomKetByName($ctrl.code, function(value) {
                id = value;

                if (value === "") {
                    //Create new room
                    var newRoomKey = firebase.database().ref().child('room').push().key;
                    id = newRoomKey;
                    var newRoom = {
                        name: $ctrl.code,
                        date: new Date(),
                        userAgent: navigator.userAgent
                    }

                    var updates = {};
                    updates['/room/' + id] = newRoom;
                    firebase.database().ref().update(updates);
                }

                $ctrl.$router.navigate(['Notes', {id: id}]);
            });
        }

       this.$routerOnActivate = function(next) {
        componentHandler.upgradeAllRegistered();
        }
        
        function getRoomKetByName(name, callback) {
            firebase.database().ref('/room/').orderByChild('name').equalTo(name).once('value').then(function(snapshot) {
                if (snapshot.val() !== null) {
                    snapshot.forEach((child) => {
                        return callback(child.key);
                    });
                } else {
                    return callback("");
                }
            });
        }

    }

    angular.module('index', [])
        .component('index', {
            templateUrl: 'app/components/index.html',
            bindings: {
                $router: '<'
            },
            controller: index
        });
})(window.angular);