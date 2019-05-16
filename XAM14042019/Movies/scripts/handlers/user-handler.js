import MessageService from '../services/message-service.js';
import UserService from '../services/user-service.js';
import Router from '../router.js';

const UserHandler = (() => {
	function loginGet(context) {
		try {
			context.loadPartials({
				content: 'templates/identity/login.hbs'
			}).then(function () {
				this.partial('templates/common/layout.hbs');
			});
		} catch (error) { console.error(error); }
	}

	function loginPost(context) {
		let username = context.params.username;
		let password = btoa(context.params.password);
		UserService.login(username, password).then((user) => {
			UserService.saveSession(user);
			MessageService.showSuccess('Login successful.');
			context.redirect(Router.homeRoute);
		}).catch((error) => {
			if (error.responseJSON.error === 'InvalidCredentials') {
				MessageService.showError(error.responseJSON.description);
			} else console.error(error.responseJSON);
		});
	}

	function logout(context) {
		UserService.logout().then(() => {
			sessionStorage.clear();
			MessageService.showSuccess('Logout successful.');
			context.redirect(Router.loginRoute);
		}).catch((error) => console.error(error.responseJSON));
	}

	function registerGet(context) {
		try {
			context.loadPartials({
				content: 'templates/identity/register.hbs'
			}).then(function () {
				this.partial('templates/common/layout.hbs');
			});
		} catch (error) { console.error(error); }
	}

	function registerPost(context) {
		let password = context.params.password.trim();
		if (!password || /\S{6,}/g.test(password) === false) {
			return MessageService.showError('Password must be at least 6 symbols');
		}
		let repeatPassword = context.params.repeatPassword.trim();
		if (repeatPassword !== password) {
			return MessageService.showError('Passwords must match');
		}
		let username = context.params.username.trim();
		if (!username || /\S{3,}/g.test(username) === false) {
			return MessageService.showError('Username must be at least 3 symbols');
		}
		try {
			UserService.isExistingUsername(username).then((response) => {
				if (response.usernameExists === true) {
					return MessageService.showError(`Username '${username}' is already taken`);
				}
				UserService.register(username, btoa(password)).then((user) => {
					UserService.saveSession(user);
					MessageService.showSuccess('User registration successful.');
					context.redirect(Router.homeRoute);
				}).catch((error) => console.error(error.responseJSON));
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	return {
		loginGet,
		loginPost,
		logout,
		registerGet,
		registerPost
	};
})();

export default UserHandler;