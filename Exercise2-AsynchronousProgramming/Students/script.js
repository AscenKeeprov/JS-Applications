$(document).ready(() => {
	const hostUrl = 'https://baas.kinvey.com';
	const applicationKey = 'kid_BJXTsSi-e';
	const collectionName = 'students';
	const authorizationToken = btoa('guest:guest');
	const headers = {
		'Authorization': `Basic ${authorizationToken}`,
		'Content-Type': 'application/json'
	};
	const recordsPerPage = 20;
	let tableBody = $('tbody');
	let tableFooter = $('tfoot');
	let currentPage = 1;
	let maxPages = 1;
	$('#addBtn').click(addRecord);
	async function addRecord() {
		if ($('#newRecord').length === 0) {
			$('<tr>').attr('id', 'newRecord').append(
				$('<td>').append($('<input>').addClass('ID').attr('min', 1)
					.prop({ type: 'number', required: true })),
				$('<td>').append($('<input>').addClass('FirstName')
					.prop({ type: 'text', maxlength: 32, required: true })),
				$('<td>').append($('<input>').addClass('LastName')
					.prop({ type: 'text', maxlength: 32, required: true })),
				$('<td>').append($('<input>').addClass('FacultyNumber')
					.prop({ type: 'text', maxlength: 16, required: true })),
				$('<td>').append($('<input>').addClass('Grade')
					.attr({ max: 6, min: 2, step: 0.01 })
					.prop({ type: 'number', required: true })),
				$('<td>').append
					($('<button>').addClass('saveBtn').attr('title', 'Save record')
						.html('&#128190;').click(saveRecord))
			).prependTo(tableBody);
		}
	}
	async function loadStudents() {
		$.ajax({
			method: 'GET',
			url: `${hostUrl}/appdata/${applicationKey}/${collectionName}`,
			headers
		})
			.done((students) => {
				maxPages = Math.ceil(students.length / recordsPerPage);
				populateTable(students);
			})
			.fail((response) => console.error(response.responseJSON.description));
	}
	async function populateTable(students) {
		if (students && Array.isArray(students) && students.length > 0) {
			students.sort((s1, s2) => s1.ID - s2.ID);
			let startRecord = (currentPage - 1) * recordsPerPage;
			let endRecord = Math.min(startRecord + recordsPerPage, students.length - 1);
			tableBody.empty();
			for (let record = startRecord; record < endRecord; record++) {
				let student = students[record];
				createTableRow(student).appendTo(tableBody);
			}
			tableFooter.empty();
			let pagination = $('<tr>').addClass('pagination').append($('<td>'));
			for (let page = 1; page <= maxPages; page++) {
				$('<button>').addClass('pageBtn').attr('value', page).text(page)
					.click(goToPage).appendTo(pagination.children('td').first());
			}
			pagination.appendTo(tableFooter);
		}
	}
	async function saveRecord() {
		let inputs = $('#newRecord').find('input');
		let validationErrors = [];
		if (inputs.filter('.ID').val() < 1)
			validationErrors.push('ID must be a positive integer!');
		if (!isValidName(inputs.filter('.FirstName').val())
			|| !isValidName(inputs.filter('.LastName').val()))
			validationErrors.push('Names should be between 1 and 32 characters long,\n'
				+ ' start with a capital letter and contain only latin letters,\n'
				+ ' dots, dashes and apostrophes!');
		if (/^[1-9]\d{0,15}$/g.test(inputs.filter('.FacultyNumber').val()) === false)
			validationErrors.push('Faculty number must consist of 1 to 16 digits!');
		if (inputs.filter('.Grade').val() < 2 || inputs.filter('.Grade').val() > 6)
			validationErrors.push('Grade should be between 2 and 6!');
		if (validationErrors.length > 0) alert(validationErrors.join('\n'));
		else {
			$.ajax({
				method: 'POST',
				url: `${hostUrl}/appdata/${applicationKey}/${collectionName}`,
				headers,
				data: JSON.stringify({
					ID: Number(inputs.filter('.ID').val()),
					FirstName: inputs.filter('.FirstName').val(),
					LastName: inputs.filter('.LastName').val(),
					FacultyNumber: inputs.filter('.FacultyNumber').val(),
					Grade: Number(inputs.filter('.Grade').val())
				})
			})
				.done((student) => {
					$('#newRecord').remove();
					createTableRow(student).prependTo(tableBody);
				})
				.fail((response) => console.error(response.responseJSON.description));
		}
	}
	function createTableRow(student) {
		return $('<tr>').addClass('student').attr('data-id', student._id).append(
			$('<td>').addClass('ID').html(`${student.ID}`),
			$('<td>').addClass('FirstName').html(`${student.FirstName}`),
			$('<td>').addClass('LastName').html(`${student.LastName}`),
			$('<td>').addClass('FacultyNumber').html(`${student.FacultyNumber}`),
			$('<td>').addClass('Grade').html(`${student.Grade}`),
			$('<td>').append($('<button>').addClass('deleteBtn').html('&#10006;'))
		);
	}
	function goToPage() {
		currentPage = this.value;
		loadStudents();
	}
	function isValidName(name) {
		return /^[A-Z]['A-Za-z.-]{0,31}$/g.test(name);
	}
	loadStudents();
});