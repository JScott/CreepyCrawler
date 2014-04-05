var fs = require('fs');
var casper = require('casper').create({
	logLevel: 'debug',
	verbose: false
});
var spider = require('./spider');
var linter = require('arialinter')();

// Set up the page
casper.start("http://www.google.com", function() {
	linter.initialize(this.getCurrentUrl(), function() {
		if (linter.evaluate()) {
			casper.log("Success");
		}
		else {
			casper.log("Fail");
		}
	});
	//spider.crawl(url);
});

casper.run();
