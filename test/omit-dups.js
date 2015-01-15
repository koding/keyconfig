var test = require('tape');
var keymapset = require('../lib/keymapset');

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

test('omit dup bindings', function (t) {
  t.plan(1);
  var set = keymapset('a', models);
  var model = set.models[2];
  t.deepEqual(model.binding, [['z+x'], []]);
});
