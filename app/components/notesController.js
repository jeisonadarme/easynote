(function(angular) {
    'use strict';

    function notes($scope) {
        var $ctrl = this;
        var id;
        $ctrl.notes = [];    

        this.$routerOnActivate = function(next) {
             id = next.params.id;
            //printNotesByRoomKey(id);
            componentHandler.upgradeAllRegistered();

            var commentsRef = firebase.database().ref('/notes/').orderByChild('roomId').equalTo(id);
            //commentsRef = commentsRef.orderByChild('date');
            commentsRef.on('child_added', function(data) {
                console.log(data.val());
                $ctrl.notes.unshift(data.val());

                    $scope.$apply();
            });

            commentsRef.on('child_changed', function(data) {
                console.log(data.val());
            });

            commentsRef.on('child_removed', function(data) {
                console.log(data.val());
            });

        }
        
        $ctrl.submit = function() {
            var note = firebase.database().ref().child('notes').push().key;
            var newNote = {
                title: $ctrl.title,
                text: $ctrl.text,
                roomId: id,
                date: new Date()
            }

            var updates = {};
            updates['/notes/' + note] = newNote;
            firebase.database().ref().update(updates);

            $ctrl.text = "";
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