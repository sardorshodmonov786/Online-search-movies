$(document).ready(function () {
	var SEARCH_QUERY;
	var elSearchResults = $('.search-results');

	var createResultItem = function (title, imdbId) {
		return '<li class="columns is-vcentered"><div class="search-result-title column is-10">' + title + '</div><div class="column has-text-centered"><button class="show-info-button button is-small is-info" type="button" data-imdb-id="' + imdbId + '">Info</button></div></li>';
	};

	var showSearchResults = function (movies) {
		elSearchResults.html('');
		movies.forEach(function (movie) {
			elSearchResults.append(createResultItem(movie.Title, movie.imdbID));
		});
	};

	var createPagination = function (pagesCount) {
		$('.pagination-list').html('');
		for (var i = 1; i <= pagesCount; i++) {
			if (i === 1) {
				$('.pagination-list').append('<li><button class="pagination-link button is-small is-info" type="button" data-page-link="' + SEARCH_QUERY + '&page=' + i + '">' + i + '</button></li>');
			} else {
				$('.pagination-list').append('<li><button class="pagination-link button is-small" type="button" data-page-link="' + SEARCH_QUERY + '&page=' + i + '">' + i + '</button></li>');
			}
		}
	};

	$('.search-form').on('submit', function (evt) {
		// Submit hodisasini to'xtatish
		evt.preventDefault();

		// Formni va inputni o'zgaruvchiga saqlab olamiz
		var thisForm = $(this);
		var searchQueryInput = thisForm.find('.search-query-input');

		// Kinoni qidirish uchun linkni tayyorlash
		var queryLink = thisForm.attr('action') + searchQueryInput.val();
		SEARCH_QUERY = queryLink;

		var disableSearchForm = function () {
			searchQueryInput.attr('disabled', true);
			thisForm.find('.search-button').addClass('is-loading');
		};

		var activateSearchForm = function () {
			searchQueryInput.attr('disabled', false);
			thisForm.find('.search-button').removeClass('is-loading');
		};

		var showResult = function (response) {
			if (!response.hasOwnProperty('totalResults')) {
				elSearchResults.html('No movie found');
				return;
			}

			showSearchResults(response.Search);

			var pagesCount = Math.ceil(response.totalResults / 10);
			createPagination(pagesCount);
		};

		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: queryLink,
			beforeSend: disableSearchForm,
			complete: activateSearchForm,
			success: showResult,
			error: function (xhr, status, error) {
				alert(status + ' ' + error);
			}
		});
	});

	var getMovieInfo = function () {
		var thisButton = $(this);
		var movieLink = 'http://www.omdbapi.com/?apikey=249e8962&i=' + thisButton.data('imdb-id');

		var showMovieInfo = function (response) {
			var movie = $('.movie');
			if (response.Poster !== 'N/A') {
				movie.find('.movie-poster').attr('src', response.Poster);	
			} else {
				movie.find('.movie-poster').attr('src', 'https://placehold.it/400x500');	
			}
			movie.find('.movie-title').text(response.Title);
			movie.find('.movie-year').text(response.Year);
			movie.find('.movie-runtime').text(response.Runtime);
			movie.find('.movie-rated').text(response.Rated);
			movie.find('.movie-genres').text(response.Genre);
			movie.find('.movie-release-date').text(response.Released);
			movie.find('.movie-language').text(response.Language);
			movie.find('.movie-country').text(response.Country);
			movie.find('.metascore-rating').text(response.Metascore);
			if (response.Ratings[1]) {
				movie.find('.rt-rating').text(response.Ratings[1].Value);
			} else {
				movie.find('.rt-rating').text('N/A');
			}
			movie.find('.imdb-rating').text(response.imdbRating);
			movie.find('.movie-plot').text(response.Plot);
			movie.find('.movie-director').text(response.Director);
			movie.find('.movie-writers').text(response.Writer);
			movie.find('.movie-stars').text(response.Actors);
			movie.find('.movie-awards').text(response.Awards);

			movie.removeClass('is-hidden');
		};

		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: movieLink,
			beforeSend: function () {
				thisButton.addClass('is-loading');
			},
			complete: function () {
				thisButton.removeClass('is-loading');
			},
			success: showMovieInfo
		})
	};

	elSearchResults.on('click', '.show-info-button', getMovieInfo);

	$('.pagination-list').on('click', '.pagination-link', function () {
		var link = $(this).data('page-link');
		$('.pagination-link').removeClass('is-info');
		$(this).addClass('is-info');

		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: link,
			success: function (response) {
				showSearchResults(response.Search);
			}
		})
	});
});