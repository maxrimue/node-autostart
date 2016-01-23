'use strict()';

process.env.NODE_ENV = 'test';

var assert = require('assert'),
  expect = require('chai').expect,
  os = require('os'),
  exec = require('child_process').exec,
  pathToJSON = (process.env.HOME || process.env.USERPROFILE) + '/.autostart.json',
  autostart = require('../lib/index.js');

describe('Arguments', function() {
  it('should not accept too few arguments', function() {
    expect(() => autostart.enableAutostart('someString', 'anotherString', 'stillAString')).to.throw(Error);
    expect(() => autostart.disableAutostart('someString')).to.throw(Error);
    expect(() => autostart.isAutostartEnabled('someString')).to.throw(Error);
  });

  it('should not accept arguments with wrong types', function() {
    expect(() => autostart.enableAutostart(1, 2, 3, 4)).to.throw(Error);
    expect(() => autostart.enableAutostart('string', 2, 3, 4)).to.throw(Error);
    expect(() => autostart.enableAutostart('string', 'string', 3, 4)).to.throw(Error);
    expect(() => autostart.enableAutostart('string', 'string', 'string', 4)).to.throw(Error);
    expect(() => autostart.disableAutostart(1, 2)).to.throw(Error);
    expect(() => autostart.disableAutostart('string', 2)).to.throw(Error);
    expect(() => autostart.isAutostartEnabled(1, 2)).to.throw(Error);
    expect(() => autostart.isAutostartEnabled('string', 2)).to.throw(Error);
  });
});

describe('isAutostartEnabled()', function() {
  it('should respond with isEnabled=false and not throw for fake service', function(done) {
    autostart.isAutostartEnabled('TestService1', function(error, isEnabled) {
      expect(isEnabled).to.equal(false);
      if (error) {
        expect(error.code).to.equal('ENOENT');
      } else {
        expect(error).to.equal(null);
      }
      done();
    });
  });
});

describe('enableAutostart()', function() {
  it('should be able to create a test service', function(done) {
    autostart.enableAutostart('TestService1', 'echo "test"', process.cwd(), function(error) {
      expect(error).to.equal(null);
      done();
    });
  });
  it('should refuse to create a service with the name of an already existing one', function(done) {
    autostart.enableAutostart('TestService1', 'echo "test"', process.cwd(), function(error) {
      expect(error).to.equal('Autostart already is enabled');
      done();
    });
  });
  it('should fail if fs.stats/crontab throws an error', function(done) {
    process.env.FORCEERROR = true;
    autostart.enableAutostart('TestService1', 'echo "test"', process.cwd(), function(error) {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('disableAutostart()', function() {
  it('should be able to delete the test service', function(done) {
    autostart.disableAutostart('TestService1', function(error) {
      expect(error).to.equal(null);
      done();
    });
  });
  it('should refuse to remove nonexistant service', function(done) {
    autostart.disableAutostart('TestService1', function(error) {
      expect(error).to.equal('Autostart is not enabled');
      done();
    });
  });
  it('should fail if fs.stats/crontab throws an error', function(done) {
    process.env.FORCEERROR = true;
    autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', function(error) {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});
