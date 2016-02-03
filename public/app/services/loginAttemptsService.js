(function() {

angular.module('loginAttemptService', [])

.factory('loginAttempt', loginAttempt);

loginAttempt.$inject = ['$http'];

function loginAttempt($http) {

	var loginAttemptFactory = {};

	loginAttemptFactory.get = function() {
		return $http.get('/log/loginattempt');
	}

	loginAttemptFactory.create = function(loginAttemptData) {
		return $http.post('/log/loginattempt', loginAttemptData);
	}
	return loginAttemptFactory;
}

})();