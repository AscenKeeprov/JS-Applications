$(document).ready(() => {
	let $allCatsElement = $('#allCats');
	async function renderCats() {
		let catsTemplateHtml = (await $.get('catsTemplate.html')).children[0].innerHTML;
		let catsTemplate = Handlebars.compile(catsTemplateHtml);
		let catsTemplateContext = {
			cats: [
				new Cat('100', 100, 'Continue', 'images/cat100.jpg'),
				new Cat('101', 101, 'Switching Protocols', 'images/cat101.jpg'),
				new Cat('200', 200, 'Ok', 'images/cat200.jpg'),
				new Cat('204', 204, 'No Content', 'images/cat204.jpg'),
				new Cat('206', 206, 'Partial Content', 'images/cat206.jpg'),
				new Cat('207', 207, 'Multi Status', 'images/cat207.jpg'),
				new Cat('301', 301, 'Moved Permanently', 'images/cat301.jpg'),
				new Cat('303', 303, 'See Other', 'images/cat303.jpg'),
				new Cat('304', 304, 'Not Modified', 'images/cat304.jpg'),
				new Cat('400', 400, 'Bad Request', 'images/cat400.jpg'),
				new Cat('404', 404, 'Not Found', 'images/cat404.jpg'),
				new Cat('406', 406, 'Not Acceptable', 'images/cat406.jpg'),
				new Cat('410', 410, 'Gone', 'images/cat410.jpg'),
				new Cat('418', 418, "I'm A Teapot", 'images/cat418.jpg'),
				new Cat('500', 500, 'Internal Server Error', 'images/cat500.jpg'),
				new Cat('502', 502, 'Bad Gateway', 'images/cat502.jpg'),
				new Cat('511', 511, 'Network Authentication Required', 'images/cat511.jpg'),
				new Cat('599', 599, 'Network Connection Timeout Error', 'images/cat599.jpg')
			]
		};
		let catsHtml = catsTemplate(catsTemplateContext);
		$allCatsElement.html(catsHtml);
	}
	function toggleStatusCode() {
		if ($(this).text().toLowerCase().startsWith('show')) {
			$(this).text('Hide status code');
		} else $(this).text('Show status code');
		$(this).siblings().toggle();
	}
	renderCats().then(() => {
		let $showStatusCodeButtons = $('.card').find('button');
		$showStatusCodeButtons.click(toggleStatusCode);
	});
});