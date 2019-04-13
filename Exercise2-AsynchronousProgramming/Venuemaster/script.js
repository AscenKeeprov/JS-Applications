$(document).ready(function attachEvents() {
	const appHost = 'https://baas.kinvey.com';
	const appKey = 'kid_BJ_Ke8hZg';
	const authorizationToken = btoa('guest:pass');
	const headers = {
		'Authorization': `Basic ${authorizationToken}`,
		'Content-Type': 'application/json'
	};
	let $getVenuesButton = $('#getVenues');
	$getVenuesButton.click(getVenuesByDate);
	let $venuesList = $('#venue-info');
	async function confirmPurchase() {
		let $purchaseInfo = $(this).parents('.purchase-info').children('span');
		let ticketsQuantity = $purchaseInfo.get(1).innerText.split(' x ')[0];
		let venueName = $purchaseInfo.first().text();
		let venueId = (await getVenueByName(venueName))[0]._id;
		$.ajax({
			method: 'POST',
			url: `${appHost}/rpc/${appKey}/custom/purchase?venue=${venueId}&qty=${ticketsQuantity}`,
			headers
		})
			.then((ticket) => {
				let ticketHtml = 'You may print this page as your ticket' + ticket.html;
				$venuesList.html(ticketHtml);
			})
			.catch((failure) => console.error(failure.responseJSON.description));
	}
	async function createConfirmationElements(venueName, ticketsQuantity, ticketPrice) {
		return [
			$('<span>').addClass('head').text('Confirm purchase'),
			$('<div>').addClass('purchase-info').append(
				$('<span>').html(venueName),
				$('<span>').html(`${ticketsQuantity} x ${ticketPrice.toFixed(2)}`),
				$('<span>').html(`Total: ${(ticketsQuantity * ticketPrice).toFixed(2)} lv`),
				$('<input>').click(confirmPurchase)
					.prop({ type: 'button', value: 'Confirm' })
			)
		];
	}
	async function createVenueElement(venue) {
		return $('<div>').addClass('venue').attr('id', venue._id).append(
			$('<span>').addClass('venue-name').html(`${venue.name}`).prepend(
				$('<input>').addClass('info').click(toggleVenueInfo)
					.prop({ type: 'button', value: 'More info' })
			),
			$('<div>').addClass('venue-details').append(
				$('<table>').append(
					$('<tr>').append(
						$('<th>').text('Ticket Price'),
						$('<th>').text('Quantity'),
						$('<th>')
					),
					$('<tr>').append(
						$('<td>').addClass('venue-price').html(`${venue.price} lv`),
						$('<td>').append(
							$('<select>').addClass('quantity').append(
								[...Array(5).keys()].map(k => $('<option>').text(k + 1).val(k + 1))
							)
						),
						$('<td>').append(
							$('<input>').addClass('purchase').click(buyTickets)
								.prop({ type: 'button', value: 'Purchase' })
						)
					)
				),
				$('<span>').addClass('head').text('Venue description:'),
				$('<p>').addClass('description').html(`${venue.description}`),
				$('<p>').addClass('description').html(`Starting time: ${venue.startingHour}`)
			).css('display', 'none')
		);
	}
	async function getVenueById(_id) {
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/venues/${_id}`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function getVenueByName(name) {
		let query = JSON.stringify({ name: encodeURIComponent(name) });
		try {
			return await $.ajax({
				method: 'GET',
				url: `${appHost}/appdata/${appKey}/venues?query=${query}`,
				headers
			});
		} catch (failure) { console.error(failure.responseJSON.description); }
	}
	async function getVenuesByDate() {
		let venueDate = $('#venueDate').val();
		if (venueDate) {
			try {
				let venueIds = await $.ajax({
					method: 'POST',
					url: `${appHost}/rpc/${appKey}/custom/calendar?query=${venueDate}`,
					headers
				});
				$venuesList.empty();
				for (let venueId of venueIds) {
					getVenueById(venueId).then((venue) => {
						createVenueElement(venue).then(($venueElement) => {
							$venueElement.appendTo($venuesList)
						});
					});
				}
			} catch (failure) { console.error(failure.responseJSON.description); }
		}
	}
	function buyTickets() {
		let $venue = $(this).parents('.venue');
		let venueName = $venue.find('.venue-name').text();
		let ticketsQuantity = Number($venue.find('.quantity').val());
		let ticketPrice = Number($venue.find('.venue-price').text().split(' ')[0]);
		createConfirmationElements(venueName, ticketsQuantity, ticketPrice)
			.then((confirmationElements) => {
				$venuesList.empty();
				$venuesList.append(confirmationElements);
			});
	}
	function toggleVenueInfo() {
		$(this).parents('.venue').children('.venue-details').toggle();
	}
});