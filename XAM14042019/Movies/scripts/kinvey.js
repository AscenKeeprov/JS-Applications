const Kinvey = (() => {
	const host = 'https://baas.kinvey.com';
	const appKey = 'kid_HyK1SsD_E';
	const appSecret = '262f9f124c6e4633a7aa0db0dd870d46';

	function parseAuthorizationHeaderValue(authorizationType) {
		switch (authorizationType.toUpperCase()) {
			case 'BASIC': return `Basic ${btoa(`${appKey}:${appSecret}`)}`;
			case 'KINVEY': return `Kinvey ${sessionStorage.getItem('authtoken')}`;
			default: throw new TypeError(`Unknown authorization type: ${authorizationType}`)
		}
	}

	function parseRequest(method, service, authorizationType, collection, data) {
		let url = `${host}/${service}/${appKey}/${collection || ''}`;
		url = url.replace(/\/*$/, '');
		let request = {
			headers: {
				'Authorization': parseAuthorizationHeaderValue(authorizationType),
				'Content-Type': 'application/json'
			},
			method,
			url
		};
		if (data) request.data = JSON.stringify(data);
		return request;
	}

	function get(service, authorizationType, collection) {
		return $.ajax(parseRequest('GET', service, authorizationType, collection));
	}

	function post(service, authorizationType, collection, data) {
		return $.ajax(parseRequest('POST', service, authorizationType, collection, data));
	}

	function remove(service, authorizationType, collection) {
		return $.ajax(parseRequest('DELETE', service, authorizationType, collection));
	}

	function update(service, authorizationType, collection, data) {
		return $.ajax(parseRequest('PUT', service, authorizationType, collection, data));
	}

	return {
		get,
		post,
		remove,
		update
	};
})();

export default Kinvey;