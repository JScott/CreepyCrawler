var AriaLinter = require('arialinter');

AriaLinter.initialize('https://github.com/', function() {
	if (AriaLinter.evaluate()){
		console.log('All rules were successfully passed');
	} else {
		console.log('AriaLinter found ' + AriaLinter.getErrorsFound() + ' accessibility issues');
		console.log(AriaLinter.getReport('text', 'https://github.com/'));
	}
});
