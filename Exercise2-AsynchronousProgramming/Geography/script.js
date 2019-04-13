$(document).ready(async () => {
	const appHost = 'https://baas.kinvey.com';
	const appKey = 'kid_HyK1SsD_E';
	const authorizationToken = btoa('geographer:1337');
	const headers = {
		'Authorization': `Basic ${authorizationToken}`,
		'Content-Type': 'application/json'
	};
	let $addCountryButton = $('#addCountryButton');
	$addCountryButton.click(showCountryInput);
	let $addTownButton = $('#addTownButton');
	$addTownButton.click(showTownInput);
	let $cancelAddButton = $('#cancelAddButton');
	$cancelAddButton.click(() => {
		hideAddInput();
		clearMessages();
	});
	let $countryNameInput = $('#countryNameInput');
	let $mainElement = $('main');
	let $saveAddButton = $('#saveAddButton');
	$saveAddButton.click(saveRecord);
	let $townNameInput = $('#townNameInput');
	async function activateRecordInput() {
		$(this).siblings('input').addClass('activeInput')
			.prop({ readonly: false, required: true });
		$(this).siblings('.listButton').hide();
		$(this).siblings('.saveButton').show();
		$(this).siblings('.cancelEditButton').show();
		$(this).siblings('.deleteButton').hide();
		$(this).hide();
	}
	async function addCountry(countryName) {
		if (!isValidName(countryName)) {
			return displayError('Invalid country name!');
		}
		let existingCountries = $('#countriesList').find('.countryName')
			.map(function () { return $(this).attr('value') }).get();
		if (existingCountries.includes(countryName)) {
			return displayError(`Country '${countryName}' already exists.`);
		}
		$.ajax({
			method: 'POST',
			url: `${appHost}/appdata/${appKey}/countries`,
			headers,
			data: JSON.stringify(new Country(countryName))
		})
			.done(async (country) => {
				displayInfo(`Country '${country.name}' added successfully.`);
				hideAddInput();
				clearMessages();
				let countries = await loadCountries();
				populateCountriesList(countries);
				return country;
			})
			.fail((response) => console.error(response.responseJSON.description));
	}
	async function addTown(townName, countryName) {
		if (!isValidName(countryName)) {
			return displayError('Invalid country name!');
		}
		if (!isValidName(townName)) {
			return displayError('Invalid town name!');
		}
		let $countryRecord = $('#countriesList').find(`.countryName[value="${countryName}"]`);
		if ($countryRecord.length === 0) {
			return displayError(`Country ${countryName} does not exist! Add it first.`);
		}
		let existingTowns = await getTownsByCountryName(countryName);
		if (existingTowns.some(t => t.name === townName)) {
			return displayError(`Town '${townName}' is already in country '${countryName}'.`);
		}
		let country = (await getCountryByName(countryName))[0];
		$.ajax({
			method: 'POST',
			url: `${appHost}/appdata/${appKey}/towns`,
			headers,
			data: JSON.stringify(new Town(townName, country))
		})
			.done(async (town) => {
				displayInfo(`Town '${town.name}' added to country '${country.name}' successfully.`);
				hideAddInput();
				clearMessages();
				let towns = await getTownsByCountryId(country._id);
				populateCountryTownsList(country._id, towns)
				return town;
			})
			.fail((response) => console.error(response.responseJSON.description));
	}
	async function deactivateRecordInput() {
		let $listItemInput = $(this).siblings('input');
		$listItemInput.removeClass('activeInput')
			.prop({ readonly: true, required: false })
			.val($listItemInput.attr('value'));
		$(this).siblings('.listButton').show();
		$(this).siblings('.saveButton').hide();
		$(this).siblings('.editButton').show();
		$(this).siblings('.deleteButton').show();
		$(this).hide();
		clearMessages();
	}
	async function deleteCountry(countryId) {
		let countryName = $(`#${countryId} .countryName`).attr('value');
		let countryTownsIds = (await getTownsByCountryName(countryName))
			.map(town => town._id);
		for (let townId of countryTownsIds) {
			$.ajax({
				method: 'DELETE',
				url: `${appHost}/appdata/${appKey}/towns/${townId}`,
				headers
			})
				.fail((response) => console.error(response.responseJSON.description));
		}
		$.ajax({
			method: 'DELETE',
			url: `${appHost}/appdata/${appKey}/countries/${countryId}`,
			headers
		})
			.done(() => {
				let countryName = $(`#${countryId} .countryName`).val();
				displayInfo(`Country '${countryName}' deleted successfully.`);
				$(`#${countryId}`).remove();
				let $countriesList = $('#countriesList');
				if ($countriesList.children().length === 0) {
					$countriesList.replaceWith($('<span>').text('No countries available'));
				}
				clearMessages();
			})
			.fail((response) => console.error(response.responseJSON.description));
	}
	async function deleteTown(townId) {
		$.ajax({
			method: 'DELETE',
			url: `${appHost}/appdata/${appKey}/towns/${townId}`,
			headers
		})
			.done(() => {
				let townName = $(`#${townId} .townName`).val();
				displayInfo(`Town '${townName}' deleted successfully.`);
				let $townRecord = $(`#${townId}`);
				let $townsList = $townRecord.parent();
				$townRecord.remove();
				if ($townsList.children().length === 0) $townsList.remove();
				clearMessages();
			})
			.fail((response) => console.error(response.responseJSON.description));
	}
	async function getCountryById(_id) {
		let query = JSON.stringify({ _id });
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/countries?query=${query}`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function getCountryByName(name) {
		let query = JSON.stringify({ name });
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/countries?query=${query}`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function getTownById(_id) {
		let query = JSON.stringify({ _id });
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/towns?query=${query}`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function getTownsByCountryId(countryId) {
		let query = JSON.stringify({
			'country._id': countryId
		});
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/towns?query=${query}`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function getTownsByCountryName(countryName) {
		let query = JSON.stringify({
			'country.name': countryName
		});
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/towns?query=${query}`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function loadCountries() {
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/countries`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function loadCountryTowns() {
		let countryId = $(this).parents('.country').attr('id');
		let countryName = $(this).siblings('.countryName').attr('value');
		let townsList = $(`#${countryId}`).children('ul.townsList');
		if (townsList.length > 0) townsList.toggle(500);
		else {
			let towns = await getTownsByCountryName(countryName);
			populateCountryTownsList(countryId, towns)
				.then((townsList) => {
					if (townsList) townsList.toggle(500);
				});
			return towns;
		}
	}
	async function populateCountriesList(countries) {
		if (countries.length > 0) {
			countries.sort((c1, c2) => c1.name.localeCompare(c2.name));
			$mainElement.children(':not(details)').remove();
			let countriesList = $('<ul>').prop('id', 'countriesList');
			for (let country of countries) {
				$('<li>').addClass('country').prop('id', country._id)
					.append(
						$('<input>').addClass('countryName').attr('value', country.name)
							.prop('readonly', true).val(country.name),
						$('<button>').addClass('listButton').html('&#9776;')
							.prop('title', 'List towns').click(loadCountryTowns),
						$('<button>').addClass('saveButton').html('&#10004;')
							.prop('title', 'Save').click(updateRecord),
						$('<button>').addClass('cancelEditButton').text('Cancel')
							.prop('title', 'Cancel').click(deactivateRecordInput),
						$('<button>').addClass('editButton').html('&#9998;')
							.prop('title', 'Rename').click(activateRecordInput),
						$('<button>').addClass('deleteButton').html('&#10008;')
							.prop('title', 'Delete').click(deleteRecord)
					).appendTo(countriesList);
			}
			$mainElement.prepend(countriesList);
			return countriesList;
		} else $mainElement.prepend($('<span>').text('No countries available'));
	}
	async function populateCountryTownsList(countryId, towns) {
		let $countryElement = $(`#${countryId}`);
		if (towns.length > 0) {
			towns.sort((t1, t2) => t1.name.localeCompare(t2.name));
			$countryElement.find('ul').remove();
			let townsList = $('<ul>').addClass('townsList');
			for (let town of towns) {
				$('<li>').addClass('town').prop('id', town._id)
					.append(
						$('<input>').addClass('townName').attr('value', town.name)
							.prop('readonly', true).val(town.name),
						$('<button>').addClass('saveButton').html('&#10004;')
							.prop('title', 'Save').click(updateRecord),
						$('<button>').addClass('cancelEditButton').text('Cancel')
							.prop('title', 'Cancel').click(deactivateRecordInput),
						$('<button>').addClass('editButton').html('&#9998;')
							.prop('title', 'Rename').click(activateRecordInput),
						$('<button>').addClass('deleteButton').html('&#10008;')
							.prop('title', 'Delete').click(deleteRecord)
					).appendTo(townsList);
			}
			$countryElement.append(townsList);
			townsList.hide();
			return townsList;
		} else {
			$countryElement.append($('<span>').html('<br />Country has no towns'));
			setTimeout(function () {
				$countryElement.find('span').remove();
			}, 5000);
		}
	}
	async function updateCountry(countryId, countryName) {
		countryName = countryName.trim();
		if (!isValidName(countryName)) return displayError('Invalid country name!');
		let existingCountries = $('#countriesList').find('.countryName')
			.not('.activeInput').map(function () { return $(this).attr('value') }).get();
		if (existingCountries.includes(countryName)) {
			return displayError(`Country '${countryName}' already exists.`);
		}
		try {
			let country = (await getCountryById(countryId))[0];
			country.name = countryName;
			$.ajax({
				method: 'PUT',
				url: `${appHost}/appdata/${appKey}/countries/${country._id}`,
				headers,
				data: JSON.stringify(country)
			})
				.done((country) => {
					displayInfo(`Country renamed to '${country.name}' successfully.`);
					$(`#${country._id} .countryName`).attr('value', country.name);
					$(`#${country._id} .cancelEditButton`).click();
					return country;
				});
			let countryTowns = await getTownsByCountryId(countryId);
			for (let town of countryTowns) {
				town.country.name = countryName;
				$.ajax({
					method: 'PUT',
					url: `${appHost}/appdata/${appKey}/towns/${town._id}`,
					headers,
					data: JSON.stringify(town)
				});
			}
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function updateTown(townId, townName) {
		townName = townName.trim();
		if (!isValidName(townName)) return displayError('Invalid town name!');
		let existingTowns = $(`#${townId}`).siblings('.town').find('.townName')
			.map(function () { return $(this).attr('value') }).get();
		if (existingTowns.includes(townName)) {
			return displayError(`Town '${townName}' already exists.`);
		}
		try {
			let town = (await getTownById(townId))[0];
			town.name = townName;
			$.ajax({
				method: 'PUT',
				url: `${appHost}/appdata/${appKey}/towns/${town._id}`,
				headers,
				data: JSON.stringify(town)
			})
				.done((town) => {
					displayInfo(`Town renamed to '${town.name}' successfully.`);
					$(`#${town._id} .townName`).attr('value', town.name);
					$(`#${town._id} .cancelEditButton`).click();
					return town;
				});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	function clearErrorMessages() {
		$('.errorMsg').parents('.messageBox').remove();
	}
	function clearInfoMessages() {
		$('.infoMsg').parents('.messageBox').remove();
	}
	function clearMessages() {
		clearErrorMessages();
		setTimeout(function () {
			clearInfoMessages();
			$('.messageBox').remove();
		}, 5000);
	}
	function deleteRecord() {
		let listItemType = $(this).parent().prop('class');
		let listItemId = $(this).parent().attr('id');
		switch (listItemType) {
			case 'country':
				deleteCountry(listItemId);
				break;
			case 'town':
				deleteTown(listItemId);
				break;
		}
	}
	function displayError(message) {
		$('<div>').addClass('messageBox').append(
			$('<span>').addClass('errorMsg').text(message)
		).click(remove).prependTo('body');
	}
	function displayInfo(message) {
		$('<div>').addClass('messageBox').append(
			$('<span>').addClass('infoMsg').text(message)
		).click(remove).prependTo('body');
	}
	function hideAddInput() {
		$countryNameInput.hide('slide').val('');
		$townNameInput.hide('slide').val('');
		$cancelAddButton.hide();
		$saveAddButton.hide();
		$addCountryButton.show();
		$addTownButton.show();
	}
	function isValidName(name) {
		return /^([A-Z][a-z'-]+(?: *[A-Za-z][a-z'-]*)*)$/g.test(name)
	}
	function remove() {
		$(this).remove();
	}
	function saveRecord() {
		clearErrorMessages();
		let countryName = $countryNameInput.val().trim();
		if ($townNameInput.css('display') !== 'none') {
			addTown($townNameInput.val().trim(), countryName);
		} else addCountry(countryName);
	}
	function showCountryInput() {
		$addCountryButton.hide();
		$addTownButton.hide();
		$saveAddButton.show();
		$cancelAddButton.show();
		$countryNameInput.show('slide');
	}
	function showTownInput() {
		$addCountryButton.hide();
		$addTownButton.hide();
		$saveAddButton.show();
		$cancelAddButton.show();
		$townNameInput.show('slide');
		$countryNameInput.show('slide');
	}
	function updateRecord() {
		let newRecordValue = $(this).siblings('input').val();
		let oldRecordValue = $(this).siblings('input').attr('value');
		if (newRecordValue === oldRecordValue) {
			$(this).siblings('.cancelEditButton').click();
		} else {
			let listItemId = $(this).parent().attr('id');
			let listItemType = $(this).parent().prop('class');
			switch (listItemType) {
				case 'country':
					updateCountry(listItemId, newRecordValue);
					break;
				case 'town':
					updateTown(listItemId, newRecordValue);
					break;
			}
		}
	}
	loadCountries()
		.then((countries) => populateCountriesList(countries))
		.catch(console.error);
});