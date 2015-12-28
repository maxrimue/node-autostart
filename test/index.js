'use strict()';

process.env.NODE_ENV = 'test';

var assert = require('assert'),
		expect = require('chai').expect,
		os = require('os'),
		exec = require('child_process').exec,
		mock = require('mock-fs'),
		pathToJSON = (process.env.HOME || process.env.USERPROFILE) + '/.autostart.json',
		autostart = require('../index.js');

var mockedFs = {};
mockedFs[pathToJSON] = {};

describe('Arguments', function() {
	it('should not accept too few arguments', function() {
		expect(function(){autostart.enableAutostart('someString', 'anotherString', 'stillAString');}).to.throw(Error);
		expect(function(){autostart.disableAutostart('someString');}).to.throw(Error);
		expect(function(){autostart.isAutostartEnabled('someString');}).to.throw(Error);
	});

	it('should not accept arguments with wrong types', function() {
		expect(function(){autostart.enableAutostart(1, 2, 3, 4);}).to.throw(Error);
		expect(function(){autostart.enableAutostart('string', 2, 3, 4);}).to.throw(Error);
		expect(function(){autostart.enableAutostart('string', 'string', 3, 4);}).to.throw(Error);
		expect(function(){autostart.enableAutostart('string', 'string', 'string', 4);}).to.throw(Error);
		expect(function(){autostart.disableAutostart(1, 2);}).to.throw(Error);
		expect(function(){autostart.disableAutostart('string', 2);}).to.throw(Error);
		expect(function(){autostart.isAutostartEnabled(1, 2);}).to.throw(Error);
		expect(function(){autostart.isAutostartEnabled('string', 2);}).to.throw(Error);
	});
});

describe('isAutostartEnabled()', function() {
	it('should respond with isEnabled=false and not throw for fake service', function(done) {
		autostart.isAutostartEnabled('SomeNameIHopeNobodyWillEverTake', function(error, isEnabled) {
			expect(isEnabled).to.equal(false);
			expect(error).to.equal(null);
			done();
		});
	});
});

describe('enableAutostart()', function() {
	it('should be able to create a test service', function(done) {
		autostart.enableAutostart('SomeNameIHopeNobodyWillEverTake', 'echo "test"', process.cwd(), function(error) {
			expect(error).to.equal(null);
			done();
		});
	});
	it('should refuse to create a service with the name of an already existing one', function(done) {
		autostart.enableAutostart('SomeNameIHopeNobodyWillEverTake', 'echo "test"', process.cwd(), function(error) {
			expect(error).to.equal('Autostart already is enabled');
			done();
		});
	});
	it('should fail if fs.stats throws an error', function(done) {
		mock(mockedFs);
		autostart.enableAutostart('SomeNameIHopeNobodyWillEverTake', 'echo "test"', process.cwd(), function(error) {
			expect(error).to.not.equal(null);
			mock.restore();
			done();
		});
	});
});

describe('disableAutostart()', function() {
	it('should be able to delete the test service', function(done) {
		autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', function(error) {
			expect(error).to.equal(null);
			done();
		});
	});
	it('should refuse to remove nonexistant service', function(done) {
		autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', function(error) {
			expect(error).to.equal('Autostart is not enabled');
			done();
		});
	});
	it('should act differently when the .autostart file already exists', function(done) {
		autostart.enableAutostart('SomeNameIHopeNobodyWillEverTake', 'echo "test"', process.cwd(), function(error) {
			expect(error).to.equal(null);
			autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', function(error) {
				expect(error).to.equal(null);
				done();
			});
		});
	});
	it('should fail if fs.stats throws an error', function(done) {
		mock(mockedFs);
		autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', function(error) {
			expect(error).to.not.equal(null);
			console.log(error);
			done();
		});
		mock.restore();
	});
});
