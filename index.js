const BBPromise = require('bluebird'), 
    bluebird_co = require('bluebird-co/manual'),
    co = bluebird_co.co;
 
const Layer = require('express/lib/router/layer');

module.exports = function (options) {
    BBPromise.coroutine.addYieldHandler(bluebird_co.toPromise);
    
    Object.defineProperty(Layer.prototype, "handle", {
        enumerable: true,
        get: function () {
            return this.__handle;
        },
        set: function (fn) {
            this.__handle = bluebird_co.isGeneratorFunction(fn) ? wrap(fn) : fn;
        }
    });
    
    if (options){
        if (options.yieldHandler){
            bluebird_co.addYieldHandler(options.yieldHandler);
        }
        if(options.globals){
            global.Promise = BBPromise;
            global.co = co;
        }
    }

    return {
        Promise: BBPromise,
        co: co
    }
};


function wrap(original) {
  const wrapped = co.wrap(original);
  return function(req, res, next) {
    wrapped(req, res, next).catch(next);
  };
}

