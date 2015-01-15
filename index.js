var _ = require('underscore');
var keymapset = require('./lib/keymapset');
var _inherits = require('./lib/inherits-underscore');

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
