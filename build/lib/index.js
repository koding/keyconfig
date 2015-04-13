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
    if (defaults == null) {
      defaults = {};
    }
    this.models = [];
    for (name in defaults) {
      models = defaults[name];
      this.add(name, models);
    }
    Keyconfig.__super__.constructor.call(this);
  }

  Keyconfig.prototype.add = function(name, models) {
    var collection;
    collection = new Collection(name, models);
    collection.on('change', (function(_this) {
      return function(model) {
        return _this.emit('change', collection, model);
      };
    })(this));
    this.models.push(collection);
    return this;
  };

  return Keyconfig;

})(events.EventEmitter);
