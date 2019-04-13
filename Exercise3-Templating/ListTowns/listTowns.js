$(document).ready(() => {
	let $loadButton = $('#btnLoadTowns');
	let $rootElement = $('#root');
	let $townsInput = $('#towns');
	let townsTemplate = Handlebars.compile($('#towns-template').html());
	function attachEvents() {
		$loadButton.click(listTowns);
	}
	function listTowns() {
		let townNames = $townsInput.val().trim().split(', ');
		let townsTemplateContext = {
			towns: townNames.filter((value, index, array) => {
				return array.indexOf(value) === index;
			})
				.map(name => { return { name } })
				.sort((t1, t2) => t1.name.localeCompare(t2.name))
		};
		console.log(townsTemplateContext.towns);
		let townsHtml = townsTemplate(townsTemplateContext);
		$rootElement.html(townsHtml);
	}
	attachEvents();
});