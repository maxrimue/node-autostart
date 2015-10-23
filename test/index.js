'use strict()';

process.env.NODE_ENV = 'test';

var assert = require('assert'),
		expect = require('chai').expect,
		os = require('os'),
		exec = require('child_process').exec,
		autostart = require('../lib/index.js');

describe('Arguments', function() {
	it('should not accept too few arguments', function() {
		expect(autostart.enableAutostart('someString', 'anotherString', 'stillAString')).to.equal(1);
		expect(autostart.disableAutostart('someString')).to.equal(1);
		expect(autostart.isAutostartEnabled('someString')).to.equal(1);
	});

	it('should not accept arguments with wrong types', function() {
		expect(autostart.enableAutostart(1, 2, 3, 4)).to.equal(1);
		expect(autostart.enableAutostart('string', 2, 3, 4)).to.equal(1);
		expect(autostart.enableAutostart('string', 'string', 3, 4)).to.equal(1);
		expect(autostart.enableAutostart('string', 'string', 'string', 4)).to.equal(1);
		expect(autostart.disableAutostart(1, 2)).to.equal(1);
		expect(autostart.disableAutostart('string', 2)).to.equal(1);
		expect(autostart.isAutostartEnabled(1, 2)).to.equal(1);
		expect(autostart.isAutostartEnabled('string', 2)).to.equal(1);
	});
});

describe('isAutostartEnabled()', function() {
	it('should respond with isEnabled=false and not throw for fake service', function() {
		autostart.isAutostartEnabled('test', function(isEnabled, error) {
			expect(isEnabled).to.equal(false);
			if(os.platform() === 'linux') {
				expect(error).to.equal(null);
			}
			else if(os.platform() === 'darwin') {
				expect(error).to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
	it('should stop if there\'s a syntax error', function() {
		autostart.isAutostartEnabled('test;', function(isEnabled, error) {
			if(os.platform() === 'linux') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'darwin') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).not.to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
});

describe('enableAutostart()', function() {
	it('should be able to create a test service', function() {
		autostart.enableAutostart('Test', 'echo "test"', process.cwd, function(error) {
			if(os.platform() === 'darwin') {
				expect(error).to.equal(null);
			}
			else if(os.platform() === 'linux') {
				expect(error).to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
	it('should refuse to create a service with the name of an already existing one', function() {
		autostart.enableAutostart('Test', 'echo "test"', process.cwd, function(error) {
			if(os.platform() === 'darwin') {
				expect(error).to.equal('Autostart already is enabled');
			}
			else if(os.platform() === 'linux') {
				expect(error).to.equal('Autostart already is enabled');
			}
			else if(os.platform() === 'win32') {
				expect(error).to.equal('Autostart already is enabled');
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
	it('should stop if there\'s a syntax error', function() {
		autostart.enableAutostart('test;', 'echo "test"', process.cwd(), function(error) {
			if(os.platform() === 'linux') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'darwin') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).not.to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
});

describe('disableAutostart()', function() {
	it('should be able to delete the test service', function() {
		autostart.disableAutostart('Test', function(error) {
			if(os.platform() === 'darwin') {
				expect(error).to.equal(null);
			}
			else if(os.platform() === 'linux') {
				expect(error).to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
	it('should refuse to remove not-existing service', function() {
		autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', function(error) {
			if(os.platform() === 'darwin') {
				expect(error).to.equal('Autostart is not enabled, so you cannot disable it');
			}
			else if(os.platform() === 'linux') {
				expect(error).to.equal('Autostart is not enabled, so you cannot disable it');
			}
			else if(os.platform() === 'win32') {
				expect(error).to.equal('Autostart is not enabled, so you cannot disable it');
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
	it('should stop if there\'s a syntax error', function() {
		autostart.disableAutostart('test;', function(error) {
			if(os.platform() === 'linux') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'darwin') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).not.to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
	it('should act differently when the .autostart file already exists', function() {
		autostart.enableAutostart('test;', 'echo "test"', process.cwd(), function(error) {
			if(os.platform() === 'linux') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'darwin') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).not.to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
		autostart.disableAutostart('test;', function(error) {
			if(os.platform() === 'linux') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'darwin') {
				expect(error).not.to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).not.to.equal(null);
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
});
