var test = require('tape');
var keymapset = require('../lib/keymapset');
var checksum = require('keycode-checksum');

var models = [
  {
    name: 'a',
    binding: [['a+b'], ['c+d']]
  },
  {
    name: 'b',
    binding: [['c+d', 'g+h+j+d'], ['a+b']]
  },
  {
    name: 'c',
    binding: [['z+x', 'a+b', 'g+h+j+d'], ['a+b', 'c+d']]
  }
];

test('omitting binding resets a keymap', function (t) {
  t.plan(3);
  var set = keymapset('a', models);
  var model = set.models[2];
  t.equal(model.sums_win.length, 1)
  t.equal(model.sums_mac.length, 0);
  t.equal(model.sums_win[0], checksum(['z+x'])[0]);
});
