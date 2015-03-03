var Collection, Keyconfig, events, inherits_,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Collection = require('./collection');

inherits_ = require('inherits-underscore');

events = require('events');

module.exports = Keyconfig = (function(superClass) {
  extend(Keyconfig, superClass);

  inherits_(Keyconfig.prototype);

  function Keyconfig(defaults) {
    var models, name;
    this.models = (function() {
      var results;
      results = [];
      for (name in defaults) {
        models = defaults[name];
        results.push(new Collection(name, models));
      }
      return results;
    })();
  }

  return Keyconfig;

})(events.EventEmitter);
