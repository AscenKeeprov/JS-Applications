function getInfo() {
	const busInfoUrl = 'https://judgetests.firebaseio.com/businfo/';
	let busList = $('#buses');
	function displayErrorMessage() {
		$('#stopName').text('Error');
		busList.html('');
	}
	function parseBusStopInfo(busStopInfo) {
		$('#stopName').text(busStopInfo.name);
		busList.html('');
		for (let [busId, busTimeToArrival] of Object.entries(busStopInfo.buses)) {
			busList.append($(`<li>Bus ${busId} arrives in ${busTimeToArrival} minutes</li>`));
		}
	}
	let stopId = $('#stopId').val();
	$.ajax({
		method: 'GET',
		url: `${busInfoUrl}${stopId}.json`,
		success: parseBusStopInfo,
		error: displayErrorMessage
	});
}