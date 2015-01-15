var _ = require('underscore');
var _inherits = require('inherits-underscore');
var keymap = require('./keymap');

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
