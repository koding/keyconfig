Collection = require '../lib/collection'
Model = require '../lib/model'
checksum = require 'keycode-checksum'
assert = require 'assert'

describe 'Collection', ->

  it 'should proxy underscore methods', ->

    models = [
      { name: 'x', description: '551' }
      { name: 'y' }
    ]

    collection = new Collection 'x', models

    foo = collection.filter name: 'x'

    assert.equal foo.length, 1
    assert.equal foo[0].description, '551'

  it 'should get colliding bindings', ->

    c = new Collection 'x'
    c.add name: 'x', binding: [['ctrl+x']]
    c.add name: 'y', binding: [['ctrl+y', 'ctrl+x']]
    c.add name: 'z', binding: [['ctrl+z', 'ctrl+w']]

    collisions = c.getCollidingWin()

    assert.equal collisions.length, 1
    assert.equal collisions[0][0].name, 'x'
    assert.equal collisions[0][1].name, 'y'

    c = new Collection 'x'
    c.add name: 'x', binding: [null, ['ctrl+x']]
    c.add name: 'y', binding: [null, ['ctrl+y', 'ctrl+x']]
    c.add name: 'z', binding: [null, ['ctrl+z', 'ctrl+w']]

    collisions = c.getCollidingMac()

    assert.equal collisions.length, 1
    assert.equal collisions[0][0].name, 'x'
    assert.equal collisions[0][1].name, 'y'

    c = new Collection 'x'
    c.add name: 'x'
    c.add name: 'y'
    collisions = c.getCollidingWin()

    assert.equal collisions.length, 0

    c = new Collection 'x'
    c.add name: 'x', binding: [['a', null]]
    c.add name: 'y', binding: [['b', null]]

    collisions = c.getCollidingMac()
    assert.equal collisions.length, 0

    collisions = c.getCollidingWin()
    assert.equal collisions.length, 0

    c = new Collection 'x'
    c.add name: 'x', binding: [['ctrl+y']]
    c.add (model = new Model name: 'y', binding: [['ctrl+y']])
    c.add name: 'z', binding: [['ctrl+y']]
    collisions = c.getCollidingWin()

    assert.equal collisions[0].length, 3

    model.update binding: value: [['abc']]
    collisions = c.getCollidingWin()

    # collisions[0].should.have.lengthOf 2
    assert.equal collisions[0].length, 2

  it 'should throw if name is dup', ->

    c = new Collection 'x'
    c.add name: 'x'

    assert.throws -> c.add { name: 'x' }

  it 'should update a model given by its name', (done) ->

    collection = new Collection 'x'

    model = new Model
      name: 'foo',
      binding: [ [ 'z' ] ]

    collection.add model

    collection.on 'change', (expected) ->
      assert.deepEqual expected, model
      keys = model.getWinKeys()
      assert.equal keys.length, 1
      assert.deepEqual keys, ['y']
      done()

    collection.update 'foo',
      binding: 'y'

  #it 'should strip colliding stuff when updating', ->

    #collection = new Collection 'x'

    #model1 = new Model
      #name: 'foo'
      #binding: [ [ 'z' ] ]

    #model2 = new Model
      #name: 'bar'
      #binding: [ [ 'z+i+k' ] ]

    #collection.add model1
    #collection.add model2

    #collection.update 'bar',
      #binding: [ [ 'z' ] ]

    #model2.getWinKeys().should.have.lengthOf 0
