import Kinvey from '../kinvey.js';

const MovieService = (() => {
	function addMovie(movieData) {
		return Kinvey.post('appdata', 'Kinvey', 'movies', movieData);
	}

	async function buyTicket(movieId) {
		let movie = await Kinvey.get('appdata', 'Kinvey', `movies/${movieId}`);
		if (movie.tickets <= 0) throw {
			message: `No tickets available for movie ${movie.title}`
		}
		movie.tickets = Number(movie.tickets) - 1;
		return Kinvey.update('appdata', 'Kinvey', `movies/${movieId}`, movie);
	}

	function deleteMovieById(movieId) {
		let query = `query={"_id":"${movieId}"}`;
		return Kinvey.remove('appdata', 'Kinvey', `movies?${query}`);
	}

	function getAllSortByGenre(genres) {
		let query = `query={"genres":{"$in":${JSON.stringify(genres)}}}`;
		let sort = 'sort={"tickets":-1}';
		return Kinvey.get('appdata', 'Kinvey', `movies?${query}&${sort}`);
	}

	function getAllSortByTickets() {
		let sort = 'sort={"tickets":-1}';
		return Kinvey.get('appdata', 'Kinvey', `movies?${sort}`);
	}

	function getAllSortByCreatorId(creatorId) {
		let query = `query={"_acl.creator":"${creatorId}"}`;
		let sort = 'sort={"tickets":-1}';
		return Kinvey.get('appdata', 'Kinvey', `movies?${query}&${sort}`);
	}

	function getMovieById(movieId) {
		return Kinvey.get('appdata', 'Kinvey', `movies/${movieId}`);
	}

	async function updateMovie(movieId, movieData) {
		let movie = await Kinvey.get('appdata', 'Kinvey', `movies/${movieId}`);
		movie.title = movieData.title;
		movie.imageUrl = movieData.imageUrl;
		movie.description = movieData.description;
		movie.genres = movieData.genres;
		movie.tickets = movieData.tickets;
		return Kinvey.update('appdata', 'Kinvey', `movies/${movieId}`, movie);
	}

	return {
		addMovie,
		buyTicket,
		deleteMovieById,
		getAllSortByCreatorId,
		getAllSortByGenre,
		getAllSortByTickets,
		getMovieById,
		updateMovie
	};
})();

export default MovieService;