(function (angular) {
    'use strict';

    function notes($scope) {
        var $ctrl = this;
        var id;
        var fileUrl = "";
        var extencion = "";
        $ctrl.notes = [];

        this.$routerOnActivate = function (next) {
            id = next.params.id;

            componentHandler.upgradeAllRegistered();

            var commentsRef = firebase.database().ref('/notes/').orderByChild('roomId').equalTo(id);

            commentsRef.on('child_added', function (data) {
                $ctrl.notes.unshift(data.val());

                $scope.$apply();
            });

            commentsRef.on('child_changed', function (data) {
                console.log(data.val());
            });

            commentsRef.on('child_removed', function (data) {
                console.log(data.val());
            });

        }

        $ctrl.isImage = function(extencion){
            if(extencion == 'png' || extencion == 'jpg' || extencion == 'jpge' || extencion == 'gif'){
                return true;
            }

            return false;
        }

        $ctrl.isPdf = function(extencion){
            console.log(extencion);
            if(extencion == 'pdf'){
                return true;
            }

            return false;
        }

        function save(){
             var note = firebase.database().ref().child('notes').push().key;

             var newNote = {
                 title: $ctrl.title,
                 text: $ctrl.text,
                 urlFile: fileUrl,
                 extencion: extencion,
                 roomId: id,
                 date: new Date()
             }
 
             var updates = {};
             updates['/notes/' + note] = newNote;
             firebase.database().ref().update(updates);
 
             $ctrl.text = "";
        }

        $ctrl.submit = function () {
            var fileButton = document.getElementById('upload');
            var file = fileButton.files[0];

            if(file !== undefined){
                var url = 'files/' + id + '/' ;
                var storageRef = firebase.storage().ref(url);
                var task = storageRef.child(file.name).put(file);
                extencion = file.name.split('.').pop(); 

                task.on('state_changed',
                    function progress(snapshot) {
                        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(percentage);
                    },
                    function error(err) {
                        console.log(err);
                    },
                    function complete() {
                        console.log('complete');
                        storageRef.child(file.name).getDownloadURL().then(function (urls) {
                            console.log(urls);
                            fileUrl = urls;
                            save();
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                );
            }
            else{
                save();
            }
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