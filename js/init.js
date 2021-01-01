// Material Design
(function ($) {
	$(function () {

		$('.sidenav').sidenav();

	}); // end of document ready
})(jQuery); // end of jQuery name space


// JQUERY 
$(document).ready(function () {
	var _url = "https://my-json-server.typicode.com/ngertiprogramming/pwaapi/products"
	var dataResult = ''
	var catResult = ''
	var categories = []

	function renderPage(data) {
		$.each(data, function (key, items) {

			_cat = items.category

			dataResult += "<div>"
				+ "<h3>" + items.name + "</h3>"
				+ "<p>" + items.category + "</p>"
			"<div>";

			if ($.inArray(_cat, categories) == -1) {
				categories.push(_cat)
				catResult += "<option value'" + _cat + "'>" + _cat + "</option>"
			}

		})

		$('#products').html(dataResult)
		$('#cat_select').html("<option value='all'>semua</option>" + catResult)
	}

	// fresh data from online
	var networkDataReceived = false
	var networkUpdate = fetch(_url).then(function (response) {
		return response.json()
	}).then(function (data) {
		networkDataReceived = true
		renderPage(data)
	})

	// return data from cache
	caches.match(_url).then(function (response) {
		if (!response) throw Error('no data on cache')
		return response.json()
	}).then(function (data) {
		if (!networkDataReceived) {
			renderPage(data)
			console.log('render data from cache')
		}
	}).catch(function () {
		return networkUpdate
	})

	// fungsi filter
	$("#cat_select").on('change', function () {
		updateProduct($(this).val())
	})

	function updateProduct(cat) {

		var dataResult = ''
		var _newUrl = _url
		if (cat != 'all')
			_newUrl = _url + "?category=" + cat

		$.get(_newUrl, function (data) {

			$.each(data, function (key, items) {

				_cat = items.category

				dataResult += "<div>"
					+ "<h3>" + items.name + "</h3>"
					+ "<p>" + items.category + "</p>"
				"<div>";

			})

			$('#products').html(dataResult)
		})
	}

});


// SERVICE WORKER
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js').then(function (registration) {
			// Registration was successfull
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function (err) {
			console.log('ServiceWorker registration failed', err);
		});
	});
}

// Old Version
// navigator.serviceWorker.register('/sw.js').then(function (reg) {
// 	// Register
// 	console.log('serviceWorker registered', reg);
// }, function (err) {
// 	// Failed
// 	console.log('serviceWorker failed register', reg);
// });

// Other Version 
// if ('serviceWorker' in navigator) {
// 	window.addEventListener('load', function () {
// 		navigator.serviceWorker.register('/sw.js')
// 			.then((reg) => console.log('serviceWorker registered', reg))
// 			.catch((err) => console.log('serviceWorker failed register', err));
// 	});
// }