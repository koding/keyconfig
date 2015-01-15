// slightly modified version of backbone's underscore proxy

var _ = require('underscore');

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
