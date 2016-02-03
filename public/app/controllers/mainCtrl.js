(function() {

angular.module('mainCtrl', [])

  .controller('mainController', mainController);

    mainController.$inject = ['$rootScope', '$location', 'Auth', 'loginAttempt'];

    function mainController($rootScope, $location, Auth, loginAttempt) {

    var vm = this;

    // get info if a person is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {

      vm.loggedIn = Auth.isLoggedIn();

      // get user information on route change
      Auth.getUser()
        .then(function(data) {
          vm.user = data;
        }, function(reason) {
          console.log('getUser failed reason', reason);
        });
    });

    // function to handle login form
    vm.doLogin = function() {

      vm.processing = true;

      // clear the error
      vm.error = '';

      // call the Auth.login() function
      Auth.login(vm.loginData.username, vm.loginData.password)
        .then(function(response) {
          var loginData = {};
          loginData.ip = response.data.ip;
          loginData.dateTime = response.data.dateTime;
          loginData.action = response.data.action;
          loginData.username = response.data.username;
          loginAttempt.create(loginData);
          return response;
        })
        .then(function(response) {
          vm.processing = false;

          //if a user successfully logs in, redirect to users page
          if (response.data.success)

            $location.path('/users');
          else
            vm.error = response.data.message;

        }, function(response) {
          console.log('Auth error login response', response);
        });
    };

    // function to handle logging out
    vm.doLogout = function() {
      Auth.logout();
      // reset all user info
      vm.user = {};
      $location.path('/login');
    };

  }

})();