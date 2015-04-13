Collection = require '../lib/collection'
Model = require '../lib/model'
checksum = require 'keycode-checksum'

describe 'Collection', ->

  it 'should proxy underscore methods', ->

    models = [
      { name: 'x', description: '551' }
      { name: 'y' }
    ]

    collection = new Collection 'x', models

    foo = collection.filter name: 'x'
    foo.should.have.lengthOf 1
    foo[0].description.should.eql '551'

  it 'should omit dups', ->

    collection = new Collection 'x', [
      { name: 'x', binding: [ [ 'a+b' ], ['c+d' ] ] }
      { name: 'y', binding: [ [ 'c+d', 'g+h+j+d' ], [ 'b+a' ] ] }
      { name: 'z', binding: [ [ 'z+x', 'a+b', 'j+h+d+g' ], [ 'a+b', 'd+c' ] ] }
    ]

    collection.models[2].binding.should.eql [[ 'z+x' ], [] ]
    collection.models[2].getWinChecksum().should.have.lengthOf 1
    collection.models[2].getMacChecksum().should.have.lengthOf 0
    collection.models[2].getWinChecksum().should.eql checksum ['x+z']

  it 'should update a model given by its name', (done) ->

    collection = new Collection 'x'

    model = new Model
      name: 'foo',
      binding: [ [ 'z' ] ]

    collection.add model

    collection.on 'change', (expected) ->
      expected.should.eql model
      keys = model.getWinKeys()
      keys.should.have.lengthOf 1
      keys.should.eql ['y']
      done()

    collection.update 'foo',
      binding: 'y'

  it 'should strip colliding stuff when updating', ->

    collection = new Collection 'x'

    model1 = new Model
      name: 'foo'
      binding: [ [ 'z' ] ]

    model2 = new Model
      name: 'bar'
      binding: [ [ 'z+i+k' ] ]

    collection.add model1
    collection.add model2

    collection.update 'bar',
      binding: [ [ 'z' ] ]

    model2.getWinKeys().should.have.lengthOf 0
