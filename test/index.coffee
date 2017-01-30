Keyconfig = require '../lib'
assert = require 'assert'

describe 'Keyconfig', ->

  it 'should proxy underscore methods', ->

    collections =
      x: [ { name: 'x0' } ]
      y: [ { name: 'y0'}, { name: 'y1' } ]

    bar = new Keyconfig collections
    baz = bar.filter name: 'y'

    assert.equal baz.length, 1
    assert.equal baz[0].name, 'y'

  it 'should emit change', (done) ->

    foo = new Keyconfig
      x: [
        { name: 'qux', description: '551' }
        { name: 'quux', binding: [ ['e+f'], null ] }
      ]

    x = foo.filter name: 'x'
    qux = x[0].filter name: 'qux'

    foo.once 'change', (collection, model) ->
      assert.equal model.description, '555'

    assert.equal qux[0].description, '551'
    qux[0].update description: '555'

    foo.once 'change', (collection, model) ->
      assert.deepEqual model.getWinKeys(), ['e+f']
      assert.deepEqual model.getMacKeys(), ['z+q', 'e+f']
      assert.equal quux[0].getMacChecksum().length, 2
      done()

    quux = x[0].filter name: 'quux'
    assert.equal quux[0].getMacChecksum().length, 0

    quux[0].update binding: [ ['e+f'], ['z+q', 'e+f'] ]
