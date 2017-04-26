(function(angular) {
    'use strict';

    function notes($scope) {
        var $ctrl = this;
        var id;
        this.$routerOnActivate = function(next) {
             id = next.params.id;
             printNotesByRoomKey(id);
            componentHandler.upgradeAllRegistered();
        }
    
        $ctrl.submit = function() {
            var note = firebase.database().ref().child('notes').push().key;
            var newNote = {
                title: $ctrl.title,
                text: $ctrl.text,
                roomId: id
            }

            var updates = {};
            updates['/notes/' + note] = newNote;
            firebase.database().ref().update(updates);
            printNotesByRoomKey(id);
        }

        function printNotesByRoomKey(key) {
            firebase.database().ref('/notes/').orderByChild('roomId').equalTo(key).once('value').then(function(snapshot) {
                if (snapshot.val() !== null) {
                    console.log(snapshot.val());
                    $ctrl.notes = snapshot.val();
                    
                    $scope.$apply();
                }
            });
        }
    }

    angular.module('notes', [])
        .component('notes', {
            templateUrl: 'app/components/notes.html',
            bindings: {
                $router: '<'
            },
            controller: notes
        });
})(window.angular);