import MessageService from '../services/message-service.js';
import UserService from '../services/user-service.js';
import PetService from '../services/pet-service.js';
import Router from '../router.js';

const PetHandler = (() => {
	function createPetGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		try {
			context.loadPartials({
				content: 'templates/pets/create.hbs'
			}).then(function () {
				this.partial('templates/common/layout.hbs');
			});
		} catch (error) { console.error(error); }
	}

	function createPetPost(context) {
		let petData = {
			category: context.params.category,
			description: context.params.description,
			imageURL: context.params.imageURL,
			likes: 0,
			name: context.params.name
		}
		try {
			PetService.createPet(petData).then((pet) => {
				MessageService.showSuccess('Pet created');
				context.redirect(Router.petsDashboardRoute);
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function deletePet(context) {
		let petId = context.params.id;
		try {
			PetService.deletePet(petId).then(() => {
				MessageService.showSuccess('Pet removed successfully!');
				context.redirect(Router.petsDashboardRoute);
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function detailsGet(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let petId = context.params.id;
		try {
			PetService.getById(petId).then((pet) => {
				context.pet = pet;
				let content = 'templates/pets/otherPetDetails.hbs';
				if (pet._acl.creator === UserService.getUserId()) {
					content = 'templates/pets/myPetDetails.hbs';
				}
				context.loadPartials({ content }).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function detailsPost(context) {
		let description = context.params.description;
		let petId = context.params.id;
		try {
			PetService.updateDescriptionById(petId, description).then(() => {
				MessageService.showSuccess('Updated successfully!');
				context.redirect(Router.petsMineRoute);
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function filterByCategory(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let category = context.params.category;
		let creatorId = UserService.getUserId();
		try {
			PetService.getByCategory(category, creatorId).then((pets) => {
				context.pets = pets;
				context.loadPartials({
					content: 'templates/pets/dashboard.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function filterByCreator(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let creatorId = UserService.getUserId();
		try {
			PetService.getByCreator(creatorId).then((pets) => {
				context.pets = pets;
				context.loadPartials({
					content: 'templates/pets/myPets.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function filterByNotCreator(context) {
		context.isAuthenticated = UserService.isAuthenticated();
		context.username = UserService.getUsername();
		let creatorId = UserService.getUserId();
		try {
			PetService.getByNotCreator(creatorId).then((pets) => {
				context.pets = pets;
				context.loadPartials({
					content: 'templates/pets/dashboard.hbs'
				}).then(function () {
					this.partial('templates/common/layout.hbs');
				});
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	function fondlePet(context) {
		let petId = context.params.id;
		try {
			PetService.updateLikesById(petId).then((pet) => {
				history.back();
				return false;
			}).catch((error) => console.error(error.responseJSON));
		} catch (error) { console.error(error); }
	}

	return {
		createPetGet,
		createPetPost,
		deletePet,
		detailsGet,
		detailsPost,
		filterByCategory,
		filterByCreator,
		filterByNotCreator,
		fondlePet
	};
})();

export default PetHandler;