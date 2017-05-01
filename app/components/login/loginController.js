(function (angular) {
    'use strict';

    function login($scope) {
        var $ctrl = this;

        $ctrl.google = function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            login(provider);
        }

        $ctrl.facebook = function () {
            var provider = new firebase.auth.FacebookAuthProvider();
            provider.addScope('user_birthday');
            login(provider);
        }

        $ctrl.twitter = function () {
            var provider = new firebase.auth.TwitterAuthProvider();
            login(provider);
        }

        $ctrl.git = function () {
            var provider = new firebase.auth.GithubAuthProvider();
            provider.addScope('repo');
            login(provider);
        }

        function getUser(uid, callback) {
            firebase.database().ref('/user/').orderByChild('uid').equalTo(uid).once('value').then(function (snapshot) {
                if (snapshot.val() !== null) {
                    snapshot.forEach((child) => {
                        return callback(child);
                    });
                } else {
                    return callback("");
                }
            });
        }

        function registerUser(currentUser) {
            var newUserKey = firebase.database().ref().child('user').push().key;
            var newUser = {
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                profession: "",
                date: new Date(),
                userAgent: navigator.userAgent
            }

            var updates = {};
            updates['/user/' + newUserKey] = newUser;
            firebase.database().ref().update(updates);
        }

        function login(provider) {
            firebase.auth().signInWithPopup(provider).then(function (result) {

            var currentUser = result.user;
            console.log(currentUser);
                    if (currentUser !== null) {
                        getUser(currentUser.uid, function (user) {
                            if (user === "") {
                                registerUser(currentUser);
                                localStorage.setItem('user', currentUser.uid);
                                $ctrl.$router.navigate(['Dashboard']);
                            }
                            else {
                                localStorage.setItem('user', currentUser.uid);
                                $ctrl.$router.navigate(['Dashboard']);
                            }
                        })
                    } else {
                        alert('no login user');
                    }

                // ...
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        }

    }

    angular.module('login', [])
        .component('login', {
            templateUrl: 'app/components/login/login.html',
            bindings: {
                $router: '<'
            },
            controller: login
        });
})(window.angular);