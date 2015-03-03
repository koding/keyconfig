var Model, checksum, defined, events, nub, xtend,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

events = require('events');

checksum = require('keycode-checksum');

xtend = require('xtend');

defined = require('defined');

nub = require('nub');

module.exports = Model = (function(superClass) {
  extend(Model, superClass);

  function Model(opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.name) {
      throw new Error('missing name');
    }
    this.name = opts.name;
    this._checksums = [];
    this.update(opts);
    Model.__super__.constructor.call(this);
  }

  Model.prototype.update = function(opts) {
    this.description = defined(opts.description, this.description, null);
    this.binding = defined(opts.binding, this.binding);
    this.binding = [].concat(this.binding).filter(Boolean);
    this.enabled = defined(opts.enabled, this.enabled, true);
    this.readonly = defined(opts.readonly, this.readonly, false);
    this.hidden = defined(opts.hidden, this.hidden, false);
    while (this.binding.length < 2) {
      this.binding.push(null);
    }
    this.binding = this.binding.map(function(x) {
      return nub([].concat(x).filter(Boolean));
    });
    this.emit('update');
    return this;
  };

  Model.prototype.toJSON = function() {
    return {
      name: this.name,
      description: this.description,
      binding: this.binding,
      enabled: this.enabled,
      readonly: this.readonly,
      hidden: this.hidden
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
