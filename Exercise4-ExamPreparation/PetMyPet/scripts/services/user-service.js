import Kinvey from '../kinvey.js';

const UserService = (() => {
	function getUserId() {
		return sessionStorage.getItem('userId');
	}

	function getUsername() {
		return sessionStorage.getItem('username') || 'Guest';
	}

	function isAuthenticated() {
		return sessionStorage.getItem('authtoken') !== null;
	}

	function isExistingUsername(username) {
		return Kinvey.post('rpc', 'Basic', 'check-username-exists', { username });
	}

	function login(username, password) {
		let data = { username, password };
		return Kinvey.post('user', 'Basic', 'login', data);
	}

	function logout() {
		return Kinvey.post('user', 'Kinvey', '_logout');
	}

	function register(username, password) {
		let data = { username, password };
		return Kinvey.post('user', 'Basic', undefined, data);
	}

	function saveSession(sessionData) {
		sessionStorage.setItem('authtoken', sessionData._kmd.authtoken);
		sessionStorage.setItem('userId', sessionData._id);
		sessionStorage.setItem('username', sessionData.username);
	}

	return {
		getUserId,
		getUsername,
		isAuthenticated,
		isExistingUsername,
		login,
		logout,
		register,
		saveSession
	};
})();

export default UserService;