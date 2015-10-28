# node-autostart   
[![Build Status](https://travis-ci.org/maxrimue/node-autostart.svg)](https://travis-ci.org/maxrimue/node-autostart) [![Coverage Status](https://coveralls.io/repos/maxrimue/node-autostart/badge.svg?branch=master&service=github)](https://coveralls.io/github/maxrimue/node-autostart?branch=master) [![Dependency Status](https://david-dm.org/maxrimue/node-autostart.svg)](https://david-dm.org/maxrimue/node-autostart) [![devDependency Status](https://david-dm.org/maxrimue/node-autostart/dev-status.svg)](https://david-dm.org/maxrimue/node-autostart#info=devDependencies) [![npm](https://img.shields.io/npm/dt/node-autostart.svg)](https://www.npmjs.com/package/node-autostart)

node-autostart is a Node.js module that enables your module to activate autostart easily. You can also use it as a global module to set-up autostart for anything and anywhere via the command line interface (CLI). Currently, it supports:

- [x] Linux
- [x] OS X
- [x] Windows

### Install:  

```
npm install -g node-autostart
```   
for use in CLI, and:   
```
npm install --save node-autostart
```   
as a dependency for your module.

### Following features could be implemented:

- [x] `.autostart` file in your `$HOME` folder to keep track of current activated services
- [x] `doctor`-function to remove old services that got forgotten

Pull requests are _very_ appreciated!

## Documentation
You can use `node-autostart` both programmatically and per CLI. 'Enabling autostart' means to make the OS run a certain command at logon of the user who 'enabled the autostart' via a program. The command could be, for example, `npm start` in a certain directory, or whatever floats your boat. Here's an example for use via the CLI:   
```
  autostart enable -n "MyAwesomeApp" -p "/home/me/MyAwesomeApp" -c "npm start"
```
to enable,
```
  autostart check -n "MyAwesomeApp"
```
to see if it is enabled, and:
```
  autostart disable -n "MyAwesomeApp"
```
to disable it.
To use it inside your Node.js app, look at the <b>API for Programmatic Use</b>, if you want to use it in the CLI, use `autostart -h` for further information.

### API for Programmatic Use

First, require this module inside your app like this:
```javascript
var autostart = require('node-autostart')
```
Now, you can simply enable autostart and disable it, and you can also check if it is enabled:
```javascript
autostart.enableAutostart(key, command, path, function (err) {
  if(err) console.error(err);
})

autostart.disableAutostart(key, function (err) {
  if(err) console.error(err);
})

autostart.isAutostartEnabled(key, function (isEnabled, err) {
  if(err) console.error(err);

  if(isEnabled) {
    console.log('Autostart is enabled');
  }
  else {
    console.log('Autostart is not enabled');
  }

})
```
#### Variables
`key`: Unique identifier for startup items (always required! (Make it unique))

`command`: Command to be executed in the specified path

`path`: Place in which the command will be executed (Use `process.cwd()` if you just want it to happen in your current working directory)
#### Functions
`.enableAutostart`
Requires `key`, `command` and `path` variables, returns `err`.

`.disableAutostart`
Requires `key` variable, returns `err`.

`.isAutostartEnabled`
Requires `key` variable, returns `isEnabled` and `err`.

### License
The MIT License (MIT)

Copyright (c) 2015 Max Rittmüller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
