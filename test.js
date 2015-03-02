'use strict';
var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var imagemin = require('./');
var testSize;

it('should minify images', function (cb) {
	this.timeout(40000);

	var stream = imagemin({
		optimizationLevel: 0
	});

	stream.once('data', function (file) {
		testSize = file.contents.length;
		console.log(fs.statSync('fixture.png').size, file.contents.length);
		assert(file.contents.length < fs.statSync('fixture.png').size);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		path: __dirname + '/fixture.png',
		contents: fs.readFileSync('fixture.png')
	}));

	stream.end();
});


it('should skip unsupported images', function (cb) {
	var stream = imagemin();

	stream.once('data', function (file) {
		assert.strictEqual(file.contents, null);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		path: __dirname + '/fixture.bmp'
	}));

	stream.end();
});
