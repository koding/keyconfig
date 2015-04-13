var Collection, Model, _, events, inherits_,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

events = require('events');

inherits_ = require('inherits-underscore');

Model = require('./model');

_ = require('lodash');

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
      return function(model) {
        return _this.add(model);
      };
    })(this));
    Collection.__super__.constructor.call(this);
  }

  Collection.prototype._getColliding = function(platform) {
    var groups, sumMethodName;
    sumMethodName = "get" + platform + "Checksum";
    groups = {};
    this.each(function(model) {
      var sums;
      sums = model[sumMethodName]();
      return sums.forEach(function(sum) {
        return groups[sum] = [].concat(groups[sum]).filter(Boolean).concat(model);
      });
    });
    return _.filter(groups, function(group) {
      return group.length > 1;
    });
  };

  Collection.prototype.getCollidingWin = function() {
    return this._getColliding('Win');
  };

  Collection.prototype.getCollidingMac = function() {
    return this._getColliding('Mac');
  };

  Collection.prototype.add = function(model) {
    var exists;
    if (!(model instanceof Model)) {
      model = new Model(model);
    }
    exists = this.find({
      name: model.name
    });
    if (exists) {
      throw 'dup';
    }
    model.on('change', (function(_this) {
      return function() {
        return _this.emit('change', model);
      };
    })(this));
    this.models.push(model);
    return this;
  };

  Collection.prototype.update = function(name, value, silent) {
    var model;
    if (value == null) {
      value = {};
    }
    if (silent == null) {
      silent = false;
    }
    model = this.find({
      name: name
    });
    if (!(model instanceof Model)) {
      throw new Error(name + " not found");
    }
    model.update(value, silent);
    return this;
  };

  Collection.prototype.toJSON = function() {
    return this.map(function(model) {
      return model.toJSON();
    });
  };

  return Collection;

})(events.EventEmitter);
