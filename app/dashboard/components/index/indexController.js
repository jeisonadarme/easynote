(function (angular) {
    'use strict';

    function index($scope) {
        var $ctrl = this;
        componentHandler.upgradeAllRegistered();
        $ctrl.notes = [];
        $ctrl.showBottons = true;
        $ctrl.showForm = true;
        $ctrl.showLoading = false;
        $ctrl.success = false;
        $ctrl.modalStyle = false;

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

        $ctrl.closeModal = function () {
            var dialog = document.querySelector('#viewnote');
            dialogPolyfill.registerDialog(dialog);
            dialog.close();
        }

        $ctrl.showImage = function (urlImage, title) {

            if(urlImage == "")
                return;

            var modal = document.getElementById('myModal');
            var img = document.getElementsByTagName('img');
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");

            modal.style.display = "block";
            modalImg.src = urlImage;
            captionText.innerHTML = title;

        }

        $ctrl.view = function (note) {
            var dialog = document.querySelector('#viewnote');
            dialogPolyfill.registerDialog(dialog);
            dialog.showModal();

            $ctrl.note = note;
        }

        this.$routerOnActivate = function () {
            getUser(function (user) {
                var commentsRef = firebase.database().ref('/notes/').orderByChild('userId').equalTo(user.key);

                commentsRef.on('child_added', function (data) {
                    $ctrl.notes.unshift(data);
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