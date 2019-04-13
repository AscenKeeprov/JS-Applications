import Kinvey from '../kinvey.js';

const PetService = (() => {
	function createPet(petData) {
		return Kinvey.post('appdata', 'Kinvey', 'pets', petData);
	}

	function deletePet(petId) {
		let query = `query={"_id":"${petId}"}`;
		return Kinvey.remove('appdata', 'Kinvey', `pets?${query}`);
	}

	function getByCategory(category, creatorId) {
		let query = `query={"_acl.creator":{"$ne":"${creatorId}"},"category":"${category}"}`;
		let sort = 'sort={"likes":-1}';
		return Kinvey.get('appdata', 'Kinvey', `pets?${query}&${sort}`);
	}

	function getByCreator(creatorId) {
		let query = `query={"_acl.creator":"${creatorId}"}`;
		return Kinvey.get('appdata', 'Kinvey', `pets?${query}`);
	}

	function getById(petId) {
		return Kinvey.get('appdata', 'Kinvey', `pets/${petId}`);
	}

	function getByNotCreator(creatorId) {
		let query = `query={"_acl.creator":{"$ne":"${creatorId}"}}`;
		let sort = 'sort={"likes":-1}';
		return Kinvey.get('appdata', 'Kinvey', `pets?${query}&${sort}`);
	}

	async function updateLikesById(petId) {
		let pet = await Kinvey.get('appdata', 'Kinvey', `pets/${petId}`);
		pet.likes = Number(pet.likes) + 1;
		return Kinvey.update('appdata', 'Kinvey', `pets/${petId}`, pet);
	}

	async function updateDescriptionById(petId, description) {
		let pet = await Kinvey.get('appdata', 'Kinvey', `pets/${petId}`);
		pet.description = description;
		return Kinvey.update('appdata', 'Kinvey', `pets/${petId}`, pet);
	}

	return {
		createPet,
		deletePet,
		getByCategory,
		getByCreator,
		getById,
		getByNotCreator,
		updateDescriptionById,
		updateLikesById
	};
})();

export default PetService;