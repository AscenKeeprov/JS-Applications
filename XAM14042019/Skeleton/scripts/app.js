import Router from './router.js';
import HomeHandler from './handlers/home-handler.js';
import UserHandler from './handlers/user-handler.js';
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
	this.get('index.html', HomeHandler.homeGet);
	this.get('/', HomeHandler.homeGet);
	this.notFound = HomeHandler.notFound;
});

$(document).ajaxStart(MessageService.showLoader);
$(document).ajaxStop(MessageService.hideLoader);
$(document).ready(() => {
	app.run(`/${Router.homeRoute}`);
});