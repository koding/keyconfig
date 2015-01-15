(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var keymapset = require(5);
var _inherits = require(3);

module.exports = keyconfig;
_inherits(keyconfig.prototype);

if ('object' === typeof window)
  window.keyconfig = module.exports;

function keyconfig (obj) {
  if (!(this instanceof keyconfig)) return new keyconfig(obj);
  this.models = _.map(obj, function (keymaps, name) {
    return keymapset(name, keymaps);
  });
}
},{}],2:[function(require,module,exports){
var fletcher16 = require(6);
var keycode = require(7);


module.exports = function (arr) {
  if (Array.isArray(arr)) {
    return arr.map(function (s) {
      if (_.isString(s)) 
        return fletcher16(_.map(s.split('+'), keycode).sort());
    });
  }
};
},{}],3:[function(require,module,exports){
var _methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

var _attr_methods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

module.exports = function (proto, methods, attr_methods) {
  methods = methods || _methods;
  attr_methods = attr_methods || _attr_methods;

  _.each(methods, function (method) {
    if (!_[method]) return;
    proto[method] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  _.each(attr_methods, function (method) {
    proto[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        if (_.isFunction(model.get)) return model.get(value);
        else return model[value];
      };
      return _[method](this.models, iterator, context);
    };
  });
};
},{}],4:[function(require,module,exports){
var checksum = require(2);

var Emitter = require('events').EventEmitter;

module.exports = keymap;

function keymap (obj) {
  if (!(this instanceof keymap)) return new keymap(obj);
  if (!obj.name) throw new Error('missing name');
  _.extend(this, {
    name: null, description: null, binding: null, options: null,
    enabled: true, readonly: false, hidden: false, 
    keys_win: null, keys_mac: null,
    sums_win: null, sums_mac: null
  }, obj);
  this._e = new Emitter;
  this._e.on('update:binding', this._reset_binding.bind(this));
  this._reset();
}

keymap.prototype._reset = function () {
  this._reset_binding();
};

keymap._KEYCODE_ATTRS = ['keys_win', 'keys_mac'];
keymap._KEYCODE_SUM_ATTRS = ['sums_win', 'sums_mac'];

keymap.prototype._reset_binding = function () {
  if (!this.binding) return;
  this.binding = _.map(this.binding, function (n) {
    if (!n) return null;
    return _.uniq(n, false);
  });
  _.extend(this, 
    _.object(keymap._KEYCODE_ATTRS, this.binding),
    _.object(keymap._KEYCODE_SUM_ATTRS, 
      _.map(this.binding, checksum.bind(checksum)))
  );
};

keymap._UPDATE_WHITELIST = ['binding', 'description', 'hidden', 'enabled'];

keymap.prototype.update = function (obj) {
  obj = _.pick(obj, keymap._UPDATE_WHITELIST);
  _.extend(this, obj);
  var self = this;
  _.each(_.keys(obj), function (key) {
    self._e.emit('update:' + key);
  });
};

keymap._JSON_WHITELIST = 
  ['name', 'description', 'binding', 'enabled', 'readonly', 'hidden'];

keymap.prototype.toJSON = function () {
  return _.pick(this, keymap._JSON_WHITELIST);
};
},{}],5:[function(require,module,exports){
var _inherits = require(3);
var keymap = require(4);

module.exports = keymapset;
_inherits(keymapset.prototype);

function keymapset (name, keymaps) {
  if (!(this instanceof keymapset)) return new keymapset(name, keymaps);
  if (!name) throw new Error('missing name');
  this.name = name;
  this.models = [];
  _.each(keymaps, this._add.bind(this));
}

keymapset.prototype._validate = function (model) {
  var self = this;
  _.each(keymap._KEYCODE_SUM_ATTRS, function (prop, i) {
    if (model[prop]) {
      var list = self.chain().pluck(prop).flatten().without(undefined, null);
      var collisions = list.intersection(model[prop]).value();
      if (collisions.length) {
        if (model.readonly) {
          throw new Error('dup: ' + model.name + ' (' + prop.split('_')[1] + ')');
        }
        else {
          collisions = _.map(collisions, function (n) {
            return model[prop].indexOf(n);
          });
          var binding = model.binding;
          binding[i] = _.filter(binding[i], function (n, i) {
            return !~collisions.indexOf(i);
          });
          model.update({ binding: binding });
        }
      }
    }
  });
  return model;
};

keymapset.prototype._add = function (obj) {
  var model = obj;
  if (!(obj instanceof keymap)) model = keymap(obj);
  model = this._validate(model);
  this.models.push(model);
};

keymapset.prototype.toJSON = function () {
  return this.map(function (model) { return model.toJSON(); });
};
},{}],6:[function(require,module,exports){
var exports = module.exports = fletcher16;
exports.fletcher16 = fletcher16;

function fletcher16(buf) {
  var sum1 = 0xff, sum2 = 0xff;
  var i = 0;
  var len = buf.length;

  while (len) {
    var tlen = len > 20 ? 20 : len;
    len -= tlen;
    do {
      sum2 += sum1 += buf[i++];
    } while (--tlen);
    sum1 = (sum1 & 0xff) + (sum1 >> 8);
    sum2 = (sum2 & 0xff) + (sum2 >> 8);
  }
  /* Second reduction step to reduce sums to 8 bits */
  sum1 = (sum1 & 0xff) + (sum1 >> 8);
  sum2 = (sum2 & 0xff) + (sum2 >> 8);
  return sum2 << 8 | sum1;
}
},{}],7:[function(require,module,exports){
var map = {
    backspace: 8
  , command: 91
  , tab: 9
  , clear: 12
  , enter: 13
  , shift: 16
  , ctrl: 17
  , alt: 18
  , capslock: 20
  , escape: 27
  , esc: 27
  , space: 32
  , pageup: 33
  , pagedown: 34
  , end: 35
  , home: 36
  , left: 37
  , up: 38
  , right: 39
  , down: 40
  , del: 46
  , comma: 188
  , f1: 112
  , f2: 113
  , f3: 114
  , f4: 115
  , f5: 116
  , f6: 117
  , f7: 118
  , f8: 119
  , f9: 120
  , f10: 121
  , f11: 122
  , f12: 123
  , ',': 188
  , '.': 190
  , '/': 191
  , '`': 192
  , '-': 189
  , '=': 187
  , ';': 186
  , '[': 219
  , '\\': 220
  , ']': 221
  , '\'': 222
};

/**
 * find a keycode.
 *
 * @param {String} name
 * @return {Number}
 */

module.exports = function(name){
  return map[name.toLowerCase()] || name.toUpperCase().charCodeAt(0);
};
},{}]},{},[1]);
