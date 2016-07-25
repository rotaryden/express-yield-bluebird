# Express-Yeild-Bluebird

ES6 generators support hack for [ExpressJS](http://expressjs.com)
using Bluebird Promise and coroutine

Exposes 'co' object compatible with [tj/co](https://github.com/tj/co)

## Usage

```
npm install express-yield-bluebird --save
```

Then require this script somewhere __before__ you start using it:

```js
const express = require('express');
const defs = require('express-yield-bluebird')();
//defs.Promise - BlueBird Promise
//defs.co - bluebird-co wrapper compatible with tj/co
const User = require('./models/user');
const app = express();

app.get('/users', function* (req, res) {
  const users = yield User.findAll(); // <- some Promise
  res.send(users);
});
```

### To define global 'Promise' and 'co'
```js
...
require('express-yield-bluebird')({globals: true});
...
new Promise(...) //BlueBird Promise globally
co.wrap(function* () {}) //bluebird-co wrapper globally
```

### To define custom yield handler (in addition to bluebird-co ones)

```javascript
...
require('express-yield-bluebird')({yieldHandler: function(value) {
   if(value instanceof MyModel) {
       return value.fetch();
   }
});
...

class MyModel {
    constructor {
    }
}

MyModel.prototype.fetch = co.wrap(function*(){});

function* test() {
    let model = new MyModel();
    let data = yield model; //calls model.fetch() and waits on it. 
}
```

## How Does This Work?

This is a very minimalistic and unintrusive hack. Instead of patching all methods
on an express `Router`, it wraps the `Layer#handle` property in one place, leaving
all the rest of the express guts intact.

The idea is that you require the patch once and then use the `'express'` lib the
usual way in the rest of your application.

## Copyright & License

MIT

Copyright (C) 2016 Denis Volokhovskiy

Copyright (C) 2016 Nikolay Nemshilov (express-yields)
