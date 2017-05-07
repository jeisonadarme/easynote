(function (angular) {
    'use strict';

    function newNote($scope) {
        var $ctrl = this;
        $ctrl.showBottons = true;
        $ctrl.showForm = true;
        $ctrl.showLoading = false;
        $ctrl.success = false;

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

        componentHandler.upgradeAllRegistered();

        $ctrl.showModal = function () {
            var dialog = document.querySelector('dialog');
            dialogPolyfill.registerDialog(dialog);
            // Now dialog acts like a native <dialog>.
            dialog.showModal();
        }

        $ctrl.closeModal = function(){
            var dialog = document.querySelector('dialog');
            dialogPolyfill.registerDialog(dialog);
            dialog.close();
            $ctrl.showBottons = true;
            $ctrl.showForm = true;
            $ctrl.showLoading = false;
            $ctrl.success = false;
            $ctrl.title = "";
            $ctrl.text = "";
        }

        function save(id, fileUrl, extencion) {
            var note = firebase.database().ref().child('notes').push().key;

            var newNote = {
                title: $ctrl.title,
                text: $ctrl.text,
                urlFile: fileUrl,
                extencion: extencion,
                userId: id,
                date: new Date()
            }

            var updates = {};
            updates['/notes/' + note] = newNote;
            firebase.database().ref().update(updates);

            $ctrl.showLoading = false;
            $ctrl.success = true;
            $scope.$apply();
            console.log('method');
        }

        $ctrl.submit = function () {
            $ctrl.showBottons = false;
            $ctrl.showLoading = true;
            $ctrl.showForm = false;

            getUser(function (user) {
                console.log(user.key);

                var id = user.key;
                var fileButton = document.getElementById('upload');
                var file = fileButton.files[0];
                var fileUrl = "";
                var extencion = "";

                if (file !== undefined) {
                    var url = 'files/' + id + '/';
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
                                save(id, fileUrl, extencion);
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    );
                }
                else {
                    save(id, fileUrl, extencion);
                }
            });
        }
    }

    angular.module('newnote', [])
        .component('newnote', {
            templateUrl: 'app/dashboard/components/newNote/newNote.html',
            bindings: {
                $router: '<'
            },
            controller: newNote
        });
})(window.angular);