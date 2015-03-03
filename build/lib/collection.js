var Collection, Model, events, inherits_,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

events = require('events');

inherits_ = require('inherits-underscore');

Model = require('./model');

module.exports = Collection = (function(superClass) {
  extend(Collection, superClass);

  inherits_(Collection.prototype);

  function Collection(name, models) {
    if (!name) {
      throw new Error('missing name');
    }
    this.name = name;
    this.models = [];
    [].concat(models).filter(Boolean).forEach((function(_this) {
      return function(x) {
        return _this.add(x);
      };
    })(this));
    Collection.__super__.constructor.call(this);
  }

  Collection.prototype._findCollisions = function(model, platform) {
    var binding, checksum, collisions, ix, list, methodName;
    methodName = "get" + platform + "Checksum";
    list = this.chain().invoke(methodName).flatten().without(void 0, null);
    checksum = model[methodName]();
    collisions = list.intersection(checksum).value();
    if (collisions.length) {
      if (model.readonly) {
        throw new Error("dup: " + model.name);
      }
    } else {
      collisions = collisions.map(function(x) {
        return checksum.indexOf(x);
      });
      binding = model.binding;
      ix = platform === 'Win' ? 0 : 1;
      binding[ix] = binding[ix].filter(function(x, i) {
        return !~collisions.indexOf(i);
      });
      model.update({
        binding: binding
      });
    }
    return model;
  };

  Collection.prototype._validate = function(model) {
    this._findCollisions(model, 'Win');
    this._findCollisions(model, 'Mac');
    return model;
  };

  Collection.prototype.add = function(model) {
    if (!(model instanceof Model)) {
      model = new Model(model);
    }
    this.models.push(this._validate(model));
    return this;
  };

  Collection.prototype.toJSON = function() {
    return this.map(function(x) {
      return x.toJSON();
    });
  };

  return Collection;

})(events.EventEmitter);
