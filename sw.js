var CACHE_NAME = 'pwa-cache-v1';
var urlsToCache = [
	'/',
	'/fallback.json',
	'/css/materialize.css',
	'/css/materialize.min.css',
	'/css/style.css',
	'/js/init.js',
	'/js/materialize.js',
	'/js/materialize.min.js',
	'/img/favicon-@32x.png',
	'/img/favicon-@64x.png'
];

// Install
self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			console.log('in install serviceWorker... cache openend!');
			return cache.addAll(urlsToCache);
		})
	);
});


// Fetch / Use Cache (cache then network)
self.addEventListener('fetch', function (event) {
	var request = event.request
	var url = new URL(request.url)

	// pisahkan request API dan Internal
	if (url.origin === location.origin) {
		event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request)
			})
		)
	} else {
		event.respondWith(
			caches.open('produts-cache-v1').then(function (cache) {
				return fetch(request).then(function (liveResponse) {
					cache.put(request, liveResponse.clone())
					return liveResponse
				}).catch(function () {
					return caches.match(request).then(function (response) {
						if (response) return response
						return caches.match('fallback.json')
					})
				})
			})
		)
	}
});


// Activate
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cacheName != CACHE_NAME
				}).map(function (cacheName) {
					return caches.delete(cacheName)
				})
			);
		})
	);
});

// Fetch / Use Cache (normal)
// self.addEventListener('fetch', function (event) {
// 	event.respondWith(
// 		caches.match(event.request).then(function (response) {
// 			// Cache ht - return response
// 			if (response) {
// 				return response;
// 			}
// 			return fetch(event.request);
// 		})
// 	);
// });

