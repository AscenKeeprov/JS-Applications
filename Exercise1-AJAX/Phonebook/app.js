$(document).ready(function attachEvents() {
	const phonebookUrl = 'https://js-applications-march-2019.firebaseio.com/phonebook';
	function deleteContact() {
		let contactId = this.parentNode.id;
		$.ajax({
			method: 'DELETE',
			url: `${phonebookUrl}/${contactId}.json`,
			success: loadContacts
		});
	}
	function loadContacts() {
		$.ajax({
			method: 'GET',
			url: `${phonebookUrl}.json`,
			success: (phonebook) => {
				$('#phonebook').html('');
				for (let [id, entry] of Object.entries(phonebook)) {
					let listItem = $('<li>');
					listItem.attr('id', id);
					listItem.text(`${entry.person}: ${entry.phone}`);
					let deleteButton = $('<button>Delete</button>');
					deleteButton.click(deleteContact);
					listItem.append(deleteButton);
					$('#phonebook').append(listItem);
				}
			}
		});
	}
	$('#btnCreate').click(() => {
		let personInput = $('#person');
		let phoneInput = $('#phone');
		if (personInput.val() && phoneInput.val()) {
			$.ajax({
				method: 'POST',
				url: `${phonebookUrl}.json`,
				data: JSON.stringify({
					person: personInput.val(),
					phone: phoneInput.val()
				}),
				success: () => {
					personInput.val('');
					phoneInput.val('');
					loadContacts();
				}
			});
		}
	});
	$('#btnLoad').click(loadContacts);
});