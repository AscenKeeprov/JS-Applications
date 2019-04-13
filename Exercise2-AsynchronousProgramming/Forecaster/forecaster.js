$(document).ready(function attachEvents() {
	Element.prototype.cleanWhitespaceOnlyTextNodes = function () {
		this.childNodes.forEach(n => {
			if (n.nodeType === 3) n.remove();
		});
	}
	const databaseUrl = 'https://judgetests.firebaseio.com'
	let locationNameInput = $('#location');
	let getWeatherButton = $('#submit');
	getWeatherButton.click(getWeather);
	async function getWeather() {
		let locationName = locationNameInput.val();
		if (locationName) {
			$('#forecast').removeAttr('style');
			try {
				let locationCode = (await $.get(`${databaseUrl}/locations.json`))
					.filter(l => l.name === locationName)[0].code;
				$.get(`${databaseUrl}/forecast/today/${locationCode}.json`)
					.then(displayCurrentForecast)
					.catch(e => console.error(e));
				$.get(`${databaseUrl}/forecast/upcoming/${locationCode}.json`)
					.then(displayThreeDayForecast)
					.catch(e => console.error(e));
			} catch (e) { console.error(e); }
		}
	}
	function displayCurrentForecast(location) {
		let currentForecastOutputElement = $('#current');
		currentForecastOutputElement.find('span').remove();
		Promise.resolve(getConditionSymbol(location.forecast.condition))
			.then((conditionSymbol) => {
				$(`<span>`).addClass('condition symbol')
					.html(conditionSymbol)
					.insertAfter('#current .label');
				currentForecastOutputElement[0].cleanWhitespaceOnlyTextNodes();
			});
		$('<span>').addClass('condition').append(
			$('<span>').addClass('forecast-data').text(`${location.name}`),
			$('<span>').addClass('forecast-data')
				.html(`${location.forecast.low}&#176;/${location.forecast.high}&#176;`),
			$('<span>').addClass('forecast-data').text(`${location.forecast.condition}`)
		).appendTo(currentForecastOutputElement);
	}
	function displayThreeDayForecast(location) {
		let upcomingForecastOutputElement = $('#upcoming');
		upcomingForecastOutputElement.find('span').remove();
		for (let day = 0; day < location.forecast.length; day++) {
			Promise.resolve(getConditionSymbol(location.forecast[day].condition))
				.then((conditionSymbol) => {
					$(`<span>`).addClass('symbol').html(conditionSymbol)
						.prependTo($('#upcoming .upcoming')[day]);
				});
			$('<span>').addClass('upcoming').append(
				$('<span>').addClass('forecast-data')
					.html(`${location.forecast[day].low}&#176;/${location.forecast[day].high}&#176;`),
				$('<span>').addClass('forecast-data').text(`${location.forecast[day].condition}`)
			).appendTo(upcomingForecastOutputElement);
		}
	}
	function getConditionSymbol(condition) {
		return new Promise(resolve => {
			switch (condition) {
				case 'Sunny': resolve('&#x2600;')
				case 'Partly sunny': resolve('&#x26C5;')
				case 'Overcast': resolve('&#x2601;')
				case 'Rain': resolve('&#x2614;')
			}
		});
	}
});