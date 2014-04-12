// URL variables
var ignoreUrlParams = true;
var visitedUrls = {};
var pendingUrls = [];
var everyStepDo = function() {};
var domainRegex = "";

// Create instances
var helpers = require('./helpers')

// Set URLs we want to skip
exports.skip = function(url) {
	visitedUrls[url] = true;
}

// Set a function we can do each step
exports.everyStepDo = function(fn) {
	everyStepDo = fn;
}

function getDomainRegex(url) {
	pathArray = url.split( '/' );
	protocol = pathArray[0];
	host = pathArray[2];
	parts = host.split('.');
	return new RegExp("^" + protocol + "//(.*?)" + parts[parts.length-2] + "\." + parts[parts.length-1]);
}

function shouldCrawl(url) {
	var correctDomain = url.match(domainRegex) !== null;
	var notVisited = visitedUrls[url] == undefined;
	return correctDomain && notVisited;
}

// Spider from the given URL
function crawl(url) {
	// Set base domain
	if(domainRegex == "") {
		domainRegex = getDomainRegex(url);
	}

	// Add the URL to the visited stack
	visitedUrls[url] = true;

	// Open the URL
	casper.open(url).then(function() {
		everyStepDo();

		// Set the status style based on server status code
		var status = this.status().currentHTTPStatus;
		switch(status) {
			case 200: var statusStyle = { fg: 'green', bold: true }; break;
			case 404: var statusStyle = { fg: 'red', bold: true }; break;
			 default: var statusStyle = { fg: 'magenta', bold: true }; break;
		}

		// Display the spidered URL and status
		this.echo(this.colorizer.format(status, statusStyle) + ' ' + url);

		// Find links present on this page
		var links = this.evaluate(function() {
			var links = [];
			Array.prototype.forEach.call(__utils__.findAll('a'), function(e) {
				links.push(e.getAttribute('href'));
			});
			return links;
		});

		// Add newly found URLs to the stack
		var baseUrl = this.getGlobal('location').origin;
		Array.prototype.forEach.call(links, function(link) {
			var newUrl = helpers.absoluteUri(baseUrl, link);
			if (ignoreUrlParams) newUrl = helpers.stripParams(newUrl);
			if (pendingUrls.indexOf(newUrl) == -1 && shouldCrawl(newUrl)) {
				//casper.echo(casper.colorizer.format('-> Pushed ' + newUrl + ' onto the stack', { fg: 'magenta' }));
				pendingUrls.push(newUrl);
			}
		});

		// If there are URLs to be processed
		if (pendingUrls.length > 0) {
			var nextUrl = pendingUrls.shift();
			//this.echo(this.colorizer.format('<- Popped ' + nextUrl + ' from the stack', { fg: 'blue' }));
			crawl(nextUrl);
		}

	});

}
exports.crawl = crawl;
