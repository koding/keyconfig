var Model, _, checksum, defined, events,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

events = require('events');

defined = require('defined');

_ = require('lodash');

checksum = require('keycode-checksum');

checksum = _.memoize(checksum);

module.exports = Model = (function(superClass) {
  extend(Model, superClass);

  function Model(value) {
    if (value == null) {
      value = {};
    }
    if (!value.name) {
      throw new Error('missing name');
    }
    this.name = value.name;
    this.update(value);
    Model.__super__.constructor.call(this);
  }

  Model.prototype.update = function(value, silent) {
    if (silent == null) {
      silent = false;
    }
    this.binding = defined(value.binding, this.binding);
    this.binding = [].concat(this.binding).slice(0, 2);
    this.options = defined(this.options);
    this.description = defined(value.description, this.description, null);
    if (_.isObject(value.options)) {
      this.options = _.extend({}, this.options, value.options);
    }
    while (this.binding.length < 2) {
      this.binding.push(null);
    }
    this.binding = this.binding.map(function(seq) {
      return _.uniq([].concat(seq).filter(Boolean));
    });
    if (!silent) {
      this.emit('change');
    }
    return this;
  };

  Model.prototype.toJSON = function() {
    return {
      name: this.name,
      description: this.description,
      binding: this.binding,
      options: this.options
    };
  };

  Model.prototype.getWinKeys = function() {
    return this.binding[0];
  };

  Model.prototype.getMacKeys = function() {
    return this.binding[1];
  };

  Model.prototype.getWinChecksum = function() {
    return checksum(this.binding[0]);
  };

  Model.prototype.getMacChecksum = function() {
    return checksum(this.binding[1]);
  };

  return Model;

})(events.EventEmitter);
