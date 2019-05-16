import MessageService from '../services/message-service.js';
import MovieService from '../services/movie-service.js';
import UserService from '../services/user-service.js';
import Router from '../router.js';

const MovieHandler = (() => {
	function addMovieGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		try {
			context.loadPartials({
				content: 'templates/movies/addMovie.hbs'
			}).then(function () {
				this.partial('templates/common/layout.hbs');
			});
		} catch (error) { console.error(error); }
	}

	function addMoviePost(context) {
		let movieData = validateMovieData(context);
		if (typeof movieData !== 'object') return;
		let movieId = context.params.id;
		try {
			MovieService.addMovie(movieData).then((movie) => {
				MessageService.showSuccess('Movie created successfully.');
				context.redirect(Router.homeRoute);
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function allMoviesGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		try {
			MovieService.getAllSortByTickets().then((movies) => {
				context.movies = movies;
				context.loadPartials({
					content: 'templates/movies/cinema.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function buyTicket(context) {
		let movieId = context.params.id;
		try {
			MovieService.buyTicket(movieId).then((movie) => {
				MessageService.showSuccess(`Successfully bought ticket for ${movie.title}!`);
			}).catch((error) => {
				if (error.responseJSON) {
					console.error(error.responseJSON);
				} else MessageService.showError(error.message);
			}).finally(() => {
				history.back();
				return false;
			});
		} catch (error) { console.error(error); }
	}

	function deleteMovieGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let movieId = context.params.id;
		try {
			MovieService.getMovieById(movieId).then((movie) => {
				context.movie = movie;
				context.movie.genres = movie.genres.join(' ');
				context.loadPartials({
					content: 'templates/movies/deleteMovie.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function deleteMoviePost(context) {
		let movieId = context.params.id;
		try {
			MovieService.deleteMovieById(movieId).then(() => {
				MessageService.showSuccess('Movie removed successfully!');
				context.redirect(Router.homeRoute);
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function editMovieGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let movieId = context.params.id;
		try {
			MovieService.getMovieById(movieId).then((movie) => {
				context.movie = movie;
				context.movie.genres = movie.genres.join(' ');
				context.loadPartials({
					content: 'templates/movies/editMovie.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function editMoviePost(context) {
		let movieData = validateMovieData(context);
		if (typeof movieData !== 'object') return;
		let movieId = context.params.id;
		try {
			MovieService.updateMovie(movieId, movieData).then((movie) => {
				MessageService.showSuccess('Movie edited successfully.');
				context.redirect(Router.movieMineRoute);
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function filterMoviesByGenre(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let genresInput = context.params.search.trim();
		if (!genresInput || genresInput === '') {
			return allMoviesGet(context);
		}
		let genres = genresInput.split(' ');
		try {
			MovieService.getAllSortByGenre(genres).then((movies) => {
				context.movies = movies;
				context.loadPartials({
					content: 'templates/movies/cinema.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function showMovieDetails(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let movieId = context.params.id;
		try {
			MovieService.getMovieById(movieId).then((movie) => {
				context.movie = movie;
				context.movie.genres = movie.genres.join(',');
				context.loadPartials({
					content: 'templates/movies/detailsMovie.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function userMoviesGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let userId = UserService.getUserId();
		try {
			MovieService.getAllSortByCreatorId(userId).then((movies) => {
				context.movies = movies;
				context.loadPartials({
					content: 'templates/movies/myMovies.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function validateMovieData(context) {
		let title = context.params.title.trim();
		if (!title || /.{6,}/g.test(title) === false) {
			return MessageService.showError('Title should be at least 6 characters long');
		}
		let description = context.params.description.trim();
		if (!description || /.{10,}/g.test(description) === false) {
			return MessageService.showError('Description should be at least 10 characters long');
		}
		let imageUrl = context.params.imageUrl.trim();
		if (!imageUrl || /^http[s]*:\/\/.+/g.test(imageUrl) === false) {
			return MessageService.showError('Image URL should start with "http://" or "https://"');
		}
		let tickets = Number(context.params.tickets.trim());
		if (isNaN(tickets) === true || tickets < 0) {
			return MessageService.showError('Available tickets must be entered as a non-negative whole number');
		}
		let genres = context.params.genres.trim();
		if (!genres || /^\S+(?: \S+)*$/g.test(genres) === false) {
			return MessageService.showError('Genres must be separated by a single space');
		}
		let validMovieData = {
			title, description, imageUrl, tickets,
			genres: genres.split(' ')
		}
		return validMovieData;
	}

	return {
		addMovieGet,
		addMoviePost,
		allMoviesGet,
		buyTicket,
		deleteMovieGet,
		deleteMoviePost,
		editMovieGet,
		editMoviePost,
		filterMoviesByGenre,
		showMovieDetails,
		userMoviesGet
	};
})();

export default MovieHandler;