import UserService from '../services/user-service.js';

const HomeHandler = (() => {
	function homeGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		try {
			context.entities = [
				'Entity 1',
				'Entity 2',
				'Entity 3',
			];
			context.loadPartials({
				content: 'templates/entities/allEntities.hbs'
			}).then(function () {
				this.partial('templates/common/layout.hbs');
			});
		} catch (error) { console.error(error); }
	}

	function notFound() {
		this.swap($('<h3>')
			.html('The requested resource could not be found &#128549'));
	}

	return {
		homeGet,
		notFound
	};
})();

export default HomeHandler;