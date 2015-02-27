var checksum = require('keycode-checksum');
var _ = require('underscore');
var Emitter = require('events').EventEmitter;

module.exports = keymap;

function keymap (obj) {
  if (!(this instanceof keymap)) return new keymap(obj);

  if (!obj.name) throw new Error('missing name');

  _.extend(this, {
    name: null, 
    description: null, 
    binding: null, 
    options: null,
    enabled: true, 
    readonly: false, 
    hidden: false, 
    keys_win: null, 
    keys_mac: null,
    sums_win: null, 
    sums_mac: null
  }, obj);

  this._e = new Emitter;
  this._e.on('update:binding', this._reset_binding.bind(this));

  this._reset();
}

keymap.prototype._reset = function () { this._reset_binding() };

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
