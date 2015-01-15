var test = require('tape');
var keymapset = require('../lib/keymapset');
var keyconfig = require('..');

var models = [
  {
    name: 'a',
    readonly: true
  },
  {
    name: 'b',
    readonly: false
  }
];

var sets = {
  a: [
    {
      name: 'a0'
    }
  ],
  b: [
    {
      name: 'b0'
    },
    {
      name: 'b1'
    }
  ]
};

test('proxy to underscore',  function (t) {
  t.plan(4);
  var set = keymapset('a', models);
  var res = set.filter({ readonly: true });
  t.equal(res.length, 1);
  t.equal(res[0].name, 'a');
  var config = keyconfig(sets);
  var set1 = config.filter({ name: 'b' });
  t.equal(set1.length, 1);
  t.equal(set1[0].name, 'b');
});
