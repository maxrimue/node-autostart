var assert = require('assert'),
		expect = require('chai').expect,
		autostart = require('../lib/index.js');

describe('Arguments', function() {
	it('should not accept too few arguments', function() {
		expect(autostart.enableAutostart('someString', 'anotherString', 'stillAString')).to.equal(1);
		expect(autostart.disableAutostart('someString')).to.equal(1);
		expect(autostart.isAutostartEnabled('someString')).to.equal(1);
	});

	it('should not accept arguments with wrong types', function() {
		expect(autostart.enableAutostart(1, 2, 3, 4)).to.equal(1);
		expect(autostart.disableAutostart(1, 2)).to.equal(1);
		expect(autostart.isAutostartEnabled(1, 2)).to.equal(1);
	});
});
