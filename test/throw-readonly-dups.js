var test = require('tape');
var keymapset = require('../lib/keymapset');

var models = [
  {
    name: 'a',
    binding: [['a+b'], ['c+d']]
  },
  {
    name: 'b',
    binding: [['c+d'], ['a+b']],
    readonly: true
  },
  {
    name: 'c',
    binding: [['a+b'], null],
    readonly: true
  }
];

test('prevent setting read-only dups', function (t) {
  t.plan(1);
  var set = keymapset('a');
  set._add(models[0]);
  set._add(models[1]);
  try {
    set._add(models[2]);
  } catch (e) {
    t.equal(e.message.substr(0, 3), 'dup');
  }
});
