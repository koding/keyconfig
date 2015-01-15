var fletcher16 = require('fletcher');
var keycode = require('yields-keycode');
var _ = require('underscore');

module.exports = function (arr) {
  if (Array.isArray(arr)) {
    return arr.map(function (s) {
      if (_.isString(s)) 
        return fletcher16(_.map(s.split('+'), keycode).sort());
    });
  }
};
