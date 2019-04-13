import Router from './router.js';
import HomeHandler from './handlers/home-handler.js';
import UserHandler from './handlers/user-handler.js';
import PetHandler from './handlers/pet-handler.js';
import MessageService from './services/message-service.js';

const app = Sammy('body', function () {
	this.use('Handlebars', 'hbs');
	this.get(Router.homeRoute, HomeHandler.homeGet);
	this.get(Router.loginRoute, UserHandler.loginGet);
	this.post(Router.loginRoute, UserHandler.loginPost);
	this.get(Router.logoutRoute, UserHandler.logout);
	this.post(Router.logoutRoute, UserHandler.logout);
	this.get(Router.petsCategoryRoute, PetHandler.filterByCategory);
	this.get(Router.petsCreateRoute, PetHandler.createPetGet);
	this.post(Router.petsCreateRoute, PetHandler.createPetPost);
	this.get(Router.petsDashboardRoute, PetHandler.filterByNotCreator);
	this.get(Router.petsDeleteRoute, PetHandler.deletePet);
	this.get(Router.petsDetailsRoute, PetHandler.detailsGet);
	this.post(Router.petsDetailsRoute, PetHandler.detailsPost);
	this.get(Router.petsMineRoute, PetHandler.filterByCreator);
	this.get(Router.petsPetRoute, PetHandler.fondlePet);
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