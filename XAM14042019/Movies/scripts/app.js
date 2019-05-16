import Router from './router.js';
import HomeHandler from './handlers/home-handler.js';
import UserHandler from './handlers/user-handler.js';
import MovieHandler from './handlers/movie-handler.js';
import MessageService from './services/message-service.js';

const app = Sammy('body', function () {
	this.use('Handlebars', 'hbs');
	this.get(Router.homeRoute, HomeHandler.homeGet);
	this.get(Router.loginRoute, UserHandler.loginGet);
	this.post(Router.loginRoute, UserHandler.loginPost);
	this.get(Router.logoutRoute, UserHandler.logout);
	this.post(Router.logoutRoute, UserHandler.logout);
	this.get(Router.registerRoute, UserHandler.registerGet);
	this.post(Router.registerRoute, UserHandler.registerPost);
	this.get(Router.movieAddRoute, MovieHandler.addMovieGet);
	this.post(Router.movieAddRoute, MovieHandler.addMoviePost);
	this.get(Router.movieAllRoute, MovieHandler.allMoviesGet);
	this.get(Router.movieBuyTicketRoute, MovieHandler.buyTicket);
	this.get(Router.movieDeleteRoute, MovieHandler.deleteMovieGet);
	this.post(Router.movieDeleteRoute, MovieHandler.deleteMoviePost);
	this.get(Router.movieDetailsRoute, MovieHandler.showMovieDetails);
	this.get(Router.movieEditRoute, MovieHandler.editMovieGet);
	this.post(Router.movieEditRoute, MovieHandler.editMoviePost);
	this.get(Router.movieGenreRoute, MovieHandler.filterMoviesByGenre);
	this.get(Router.movieMineRoute, MovieHandler.userMoviesGet);
	this.get('index.html', HomeHandler.homeGet);
	this.get('/', HomeHandler.homeGet);
	this.notFound = HomeHandler.notFound;
});

$(document).ajaxStart(MessageService.showLoader);
$(document).ajaxStop(MessageService.hideLoader);
$(document).ready(() => {
	app.run(`/${Router.homeRoute}`);
});