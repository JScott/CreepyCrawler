var casper = require('casper').create();
var spider = require('./spider');

// Set up the spider
spider.skip('http://mysite.gove/logout');
spider.everyStepDo(function() { casper.echo("TODO"); });

// Set up the page
url = 'http://mysite.gov';
casper.start();
casper.setHttpAuth('name', 'pass');

casper.thenOpen(url, function() {
	this.echo(">> Waiting for an automatic redirect");
}).waitForUrl(/Login/);

casper.waitUntilVisible('form#login', function() {
	this.echo(">> Logging in");
	this.fill('form[name="Login"]', {
		'name': 'name',
		'pass': 'pass'
	}, true);
});

// Start spidering
casper.waitForUrl(/account/, function() {
	spider.crawl(url);
});

casper.run();
