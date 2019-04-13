let result = (function solve() {
	const busScheduleUrl = 'https://judgetests.firebaseio.com/schedule/';
	let busStop = { id: 'depot', name: 'Depot', nextId: '0361' };
	function arrive() {
		$.ajax({
			method: 'GET',
			url: `${busScheduleUrl}${busStop.nextId}.json`,
			success: (nextBusStopInfo) => {
				$('.info').text(`Arriving at ${busStop.name}`);
				$('#arrive').attr('disabled', 'disabled');
				$('#depart').removeAttr('disabled');
				busStop = {
					id: busStop.nextId,
					name: nextBusStopInfo.name,
					nextId: nextBusStopInfo.next
				};
			},
			error: handleError
		});
	}
	function depart() {
		$.ajax({
			method: 'GET',
			url: `${busScheduleUrl}${busStop.id}.json`,
			success: (busStopInfo) => {
				busStop.name = busStopInfo.name;
				$('.info').text(`Next stop ${busStop.name}`);
				$('#depart').attr('disabled', 'disabled');
				$('#arrive').removeAttr('disabled');
				busStop.nextId = busStopInfo.next;
			},
			error: handleError
		});
	}
	function handleError() {
		$('.info').text('Error');
		$('#arrive').attr('disabled', 'disabled');
		$('#depart').attr('disabled', 'disabled');
	}
	return { arrive, depart };
})();