$(document).ready(function attachEvents() {
	const hostUrl = 'https://baas.kinvey.com';
	const applicationKey = 'kid_HyK1SsD_E';
	const collectionName = 'biggestCatches';
	const authorizationToken = btoa('softuni-judge:1337');
	const headers = {
		'Authorization': `Basic ${authorizationToken}`,
		'Content-Type': 'application/json'
	};
	$('button.add').click(addCatchData);
	async function addCatchData() {
		let addInputs = $('#addForm input');
		$.ajax({
			method: 'POST',
			url: `${hostUrl}/appdata/${applicationKey}/${collectionName}`,
			headers,
			data: JSON.stringify({
				angler: addInputs.filter('.angler').val(),
				weight: Number(addInputs.filter('.weight').val()),
				species: addInputs.filter('.species').val(),
				location: addInputs.filter('.location').val(),
				bait: addInputs.filter('.bait').val(),
				captureTime: Number(addInputs.filter('.captureTime').val())
			})
		})
			.done(() => {
				addInputs.val('');
				loadCatchData();
			})
			.fail((response) => console.error(response.responseJSON.description));
	}
	async function deleteCatchData() {
		let catchId = $(this).parent().attr('data-id');
		$.ajax({
			method: 'DELETE',
			url: `${hostUrl}/appdata/${applicationKey}/${collectionName}/${catchId}`,
			headers,
		})
			.done(() => loadCatchData())
			.fail((response) => console.error(response.responseJSON.description));
	}
	$('button.load').click(loadCatchData);
	async function loadCatchData() {
		$.ajax({
			method: 'GET',
			url: `${hostUrl}/appdata/${applicationKey}/${collectionName}`,
			headers
		})
			.done((catches) => {
				let catchesOutputElement = $('#catches');
				catchesOutputElement.empty();
				for (let record of catches) {
					$('<div>').addClass('catch').attr('data-id', record._id).append(
						$('<label>').text('Angler'),
						$('<input>').prop('type', 'text').addClass('angler')
							.attr('value', record.angler).val(record.angler),
						$('<label>').text('Weight'),
						$('<input>').prop('type', 'number').addClass('weight')
							.attr('value', record.weight).val(record.weight),
						$('<label>').text('Species'),
						$('<input>').prop('type', 'text').addClass('species')
							.attr('value', record.species).val(record.species),
						$('<label>').text('Location'),
						$('<input>').prop('type', 'text').addClass('location')
							.attr('value', record.location).val(record.location),
						$('<label>').text('Bait'),
						$('<input>').prop('type', 'text').addClass('bait')
							.attr('value', record.bait).val(record.bait),
						$('<label>').text('Capture Time'),
						$('<input>').prop('type', 'number').addClass('captureTime')
							.attr('value', record.captureTime).val(record.captureTime),
						$('<button>').addClass('update').text('Update').click(updateCatchData),
						$('<button>').addClass('delete').text('Delete').click(deleteCatchData)
					).appendTo(catchesOutputElement);
				}
			})
			.fail((response) => console.error(response.responseJSON.description));
	}
	async function updateCatchData() {
		let catchId = $(this).parent().attr('data-id');
		let updateInputs = $(this).siblings('input');
		$.ajax({
			method: 'PUT',
			url: `${hostUrl}/appdata/${applicationKey}/${collectionName}/${catchId}`,
			headers,
			data: JSON.stringify({
				angler: updateInputs.filter('.angler').val(),
				weight: Number(updateInputs.filter('.weight').val()),
				species: updateInputs.filter('.species').val(),
				location: updateInputs.filter('.location').val(),
				bait: updateInputs.filter('.bait').val(),
				captureTime: Number(updateInputs.filter('.captureTime').val())
			})
		})
			.done(() => loadCatchData())
			.fail((response) => console.error(response.responseJSON.description));
	}
});