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
        $ctrl.showNotify = false;

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

            if (urlImage == "")
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

        $ctrl.delete = function (note) {
            console.log(note.key)
            var note = firebase.database().ref('notes/' + note.key);
            note.remove();
        }

        var removeByAttr = function (arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {

                    arr.splice(i, 1);

                }
            }
            $scope.safeApply(function () {
                console.log("Now I'm wrapped for protection!");
            });
            return arr;
        }

        this.$routerOnActivate = function () {
            getUser(function (user) {
                var commentsRef = firebase.database().ref('/notes/').orderByChild('userId').equalTo(user.key);

                commentsRef.on('child_added', function (data) {
                    var note = data.val();
                    note["key"] = data.key;
                    $ctrl.notes.unshift(note);
                    $scope.$apply();
                    notify(note);
                });

                commentsRef.on('child_changed', function (data) {
                    console.log(data.val());
                });

                commentsRef.on('child_removed', function (data) {
                    console.log(data.val());
                    removeByAttr($ctrl.notes, 'key', data.key);
                });

                commentsRef.once('value', function (messages) {
                    $ctrl.showNotify = true;
                });
            });
        }

        function allowNotification() {
            if (!window.Notification) {
                console.log("Not supported notificatons");
            }
            else {
                Notification.requestPermission().then(function (p) {
                    if (p == 'denied') {
                        console.log("denied notifications");
                    } else if (p == 'granted') {
                        console.log("notifications allowed");
                    }
                })
            }
        }

        function notify(note) {
            if (Notification.permission != "default" && $ctrl.showNotify) {
                var notify;
                notify = new Notification(note.title, {
                    'body': note.text,
                    'icon': note.urlFile,
                    'tag': note.key
                });

                notify.onclick = function () {
                    alert(this.tag);
                }
            } else {
                allowNotification();
            }
        }

        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
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