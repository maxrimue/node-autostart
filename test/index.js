'use strict';
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const autostart = require('../index.js');

describe('Arguments', () => {
  it('should not accept too few arguments', () => {
    expect(() => autostart.enableAutostart('someString', 'anotherString')).to.throw(Error);
    expect(() => autostart.disableAutostart()).to.throw(Error);
    expect(() => autostart.isAutostartEnabled()).to.throw(Error);
  });

  it('should not accept arguments with wrong types', () => {
    expect(() => autostart.enableAutostart(1, 2, 3)).to.throw(Error);
    expect(() => autostart.enableAutostart('string', 2, 3)).to.throw(Error);
    expect(() => autostart.enableAutostart('string', 'string', 3)).to.throw(Error);
    expect(() => autostart.disableAutostart(1)).to.throw(Error);
    expect(() => autostart.isAutostartEnabled(1)).to.throw(Error);
  });
});

describe('isAutostartEnabled(): callback:', () => {
  it('should respond with isEnabled=false and not throw for fake service', done => {
    autostart.isAutostartEnabled('TestService1', (err, isEnabled) => {
      expect(isEnabled).to.equal(false);
      expect(err).to.equal(null);
      done();
    });
  });
  it('should throw an error if FORCEERROR is enabled', done => {
    process.env.FORCEERROR = true;
    autostart.isAutostartEnabled('TestService1', err => {
      expect(err).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('isAutostartEnabled(): promise:', () => {
  it('should respond with isEnabled=false and not throw for fake service', () => {
    return autostart.isAutostartEnabled('TestService1');
  });
  it('should throw an error if FORCEERROR is enabled', done => {
    process.env.FORCEERROR = true;
    autostart.isAutostartEnabled('TestService1').catch(err => {
      expect(err).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('enableAutostart(): callback:', () => {
  it('should be able to create a test service', done => {
    autostart.enableAutostart('TestService1', 'echo "test"', process.cwd(), err => {
      expect(err).to.equal(null);
      done();
    });
  });
  it('should refuse to create a service with the name of an already existing one', done => {
    autostart.enableAutostart('TestService1', 'echo "test"', process.cwd(), err => {
      expect(err).to.equal('Autostart already is enabled');
      done();
    });
  });
  it('should fail if crontab (linux) throws an error', done => {
    process.env.FORCEERROR = true;
    autostart.enableAutostart('TestService1', 'echo "test"', process.cwd(), err => {
      expect(err).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('enableAutostart(): promise:', () => {
  it('should be able to create a test service', () => {
    return autostart.enableAutostart('TestService2', 'echo "test"', process.cwd()).then(() => {});
  });
  it('should refuse to create a service with the name of an already existing one', done => {
    autostart.enableAutostart('TestService2', 'echo "test"', process.cwd()).catch(err => {
      expect(err).to.equal('Autostart already is enabled');
      done();
    });
  });
  it('should fail if crontab (linux) throws an error', done => {
    process.env.FORCEERROR = true;
    autostart.enableAutostart('TestService2', 'echo "test"', process.cwd()).catch(err => {
      expect(err).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('disableAutostart(): callback:', () => {
  it('should be able to delete the test service', done => {
    autostart.disableAutostart('TestService1', err => {
      expect(err).to.equal(null);
      done();
    });
  });
  it('should refuse to remove nonexistant service', done => {
    autostart.disableAutostart('TestService1', err => {
      expect(err).to.equal('Autostart is not enabled');
      done();
    });
  });
  it('should fail if crontab (linux) throws an error', done => {
    process.env.FORCEERROR = true;
    autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake', err => {
      expect(err).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});

describe('disableAutostart(): promise:', () => {
  it('should be able to delete the test service', () => {
    return autostart.disableAutostart('TestService2').then(() => {});
  });
  it('should refuse to remove nonexistant service', done => {
    autostart.disableAutostart('TestService2').catch(err => {
      expect(err).to.equal('Autostart is not enabled');
      done();
    });
  });
  it('should fail if crontab (linux) throws an error', done => {
    process.env.FORCEERROR = true;
    autostart.disableAutostart('SomeNameIHopeNobodyWillEverTake').catch(err => {
      expect(err).to.not.equal(null);
      process.env.FORCEERROR = false;
      done();
    });
  });
});
