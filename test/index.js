'use strict()';

process.env.NODE_ENV = 'test';

var assert = require('assert'),
		expect = require('chai').expect,
		os = require('os'),
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

describe('Checks', function() {
	it('should respond with isEnabled=false and not throw for fake service', function() {
		autostart.isAutostartEnabled('test', function(isEnabled, error) {
			expect(isEnabled).to.equal(false);
			if(os.platform() === 'linux') {
				expect(error).to.equal('Your platform currently is not supported');
			}
			else if(os.platform() === 'darwin') {
				expect(error).to.equal(null);
			}
			else if(os.platform() === 'win32') {
				expect(error).to.equal('Your platform currently is not supported');
			}
			else {
				expect(error).to.equal('Your platform currently is not supported');
			}
		});
	});
});
