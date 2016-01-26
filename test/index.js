'use strict()';

process.env.NODE_ENV = 'test';

var assert = require('assert'),
  expect = require('chai').expect,
  os = require('os'),
  exec = require('child_process').exec,
  pathToJSON = (process.env.HOME || process.env.USERPROFILE) + '/.autostart.json',
  autostart = require('../index.js');

describe('Arguments', function() {
  it('should not accept too few arguments', function() {
    expect(() => autostart.enableAutostart('someString', 'anotherString')).to.throw(Error);
    expect(() => autostart.disableAutostart()).to.throw(Error);
    expect(() => autostart.isAutostartEnabled()).to.throw(Error);
  });

  it('should not accept arguments with wrong types', function() {
    expect(() => autostart.enableAutostart(1, 2, 3)).to.throw(Error);
    expect(() => autostart.enableAutostart('string', 2, 3)).to.throw(Error);
    expect(() => autostart.enableAutostart('string', 'string', 3)).to.throw(Error);
    expect(() => autostart.disableAutostart(1)).to.throw(Error);
    expect(() => autostart.isAutostartEnabled(1)).to.throw(Error);
  });
});

describe('isAutostartEnabled(): callback:', function() {
  it('should respond with isEnabled=false and not throw for fake service', function(done) {
    autostart.isAutostartEnabled('TestService1', function(error, isEnabled) {
      expect(isEnabled).to.equal(false);
      expect(error).to.equal(null);
      done();
    });
  });
  it('should throw an error if FORCEERROR is enabled', function(done) {
    process.env.FORCEERROR = true;
    autostart.isAutostartEnabled('TestService1', function(error, isEnabled) {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('isAutostartEnabled(): promise:', function() {
  it('should respond with isEnabled=false and not throw for fake service', function() {
    return autostart.isAutostartEnabled('TestService1').then(() => {});
  });
  it('should throw an error if FORCEERROR is enabled', function(done) {
    process.env.FORCEERROR = true;
    autostart.isAutostartEnabled('TestService1').catch((error) => {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('enableAutostart(): callback:', function() {
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
  it('should fail if crontab (linux) throws an error', function(done) {
    process.env.FORCEERROR = true;
    autostart.enableAutostart('TestService1', 'echo "test"', process.cwd(), function(error) {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('enableAutostart(): promise:', function() {
  it('should be able to create a test service', function() {
    return autostart.enableAutostart('TestService2', 'echo "test"', process.cwd()).then(() => {});
  });
  it('should refuse to create a service with the name of an already existing one', function(done) {
    autostart.enableAutostart('TestService2', 'echo "test"', process.cwd()).catch((error) => {
      expect(error).to.equal('Autostart already is enabled');
      done();
    });
  });
  it('should fail if crontab (linux) throws an error', function(done) {
    process.env.FORCEERROR = true;
    autostart.enableAutostart('TestService2', 'echo "test"', process.cwd()).catch((error) => {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('disableAutostart(): callback:', function() {
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
  it('should fail if crontab (linux) throws an error', function(done) {
    process.env.FORCEERROR = true;
    autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', function(error) {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('disableAutostart(): promise:', function() {
  it('should be able to delete the test service', function() {
    return autostart.disableAutostart('TestService2').then(() => {});
  });
  it('should refuse to remove nonexistant service', function(done) {
    autostart.disableAutostart('TestService2').catch((error) => {
      expect(error).to.equal('Autostart is not enabled');
      done();
    });
  });
  it('should fail if crontab (linux) throws an error', function(done) {
    process.env.FORCEERROR = true;
    autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake').catch((error) => {
      expect(error).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});
