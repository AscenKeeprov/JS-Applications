const MessageService = (() => {
	function createMessageElement(type, text) {
		return $('<div>').addClass(`message message-${type}`).append(
			$('<span>').text(text),
			$('<button>').click(hideMessage).html('&#10008;')
		);
	}

	function fadeMessage(messageElement) {
		setTimeout(() => {
			messageElement.fadeOut(2000, function () {
				$(this).remove();
			});
		}, 3000);
	}

	function hideLoader() {
		$('.loader').fadeOut(1000, function () {
			$(this).remove();
		});
	}

	function hideMessage() {
		$(this).parents('.message').remove();
	}

	function showError(message) {
		showMessage('error', message);
	}

	function showInfo(message) {
		showMessage('info', message);
	}

	function showLoader() {
		$('.loader').remove();
		$('<div>').addClass('loader').append(
			$('<div>'),
			$('<span>').text('Loading...')
		).appendTo($('html'));
	}

	function showMessage(type, text) {
		let $message = createMessageElement(type, text);
		$message.appendTo($('html'));
		fadeMessage($message);
	}

	function showSuccess(message) {
		showMessage('success', message);
	}

	return {
		hideLoader,
		showError,
		showInfo,
		showLoader,
		showSuccess
	};
})();

export default MessageService;