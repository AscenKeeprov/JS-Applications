$(document).ready(function attachEvents() {
	const messengerDbUrl = 'https://js-applications-march-2019.firebaseio.com/messenger'
	$('#submit').click(() => {
		let authorNameInput = $('#author');
		let messageContentInput = $('#content');
		$.ajax({
			method: 'POST',
			url: `${messengerDbUrl}.json`,
			data: JSON.stringify({
				author: authorNameInput.val(),
				content: messageContentInput.val(),
				timestamp: Date.now()
			}),
			success: () => {
				authorNameInput.val('');
				messageContentInput.val('');
			}
		});
	});
	$('#refresh').click(() => {
		$.ajax({
			method: 'GET',
			url: `${messengerDbUrl}.json`,
			success: (messages) => {
				$('#messages').text('');
				for (let [id, message] of Object.entries(messages)) {
					let messageRow = `${message.author}: ${message.content}\n`
					$('#messages').text($('#messages').text() + messageRow);
				}
			}
		});
	});
});