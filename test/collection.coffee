Collection = require '../lib/collection'
Model = require '../lib/model'
checksum = require 'keycode-checksum'

describe 'Collection', ->

  it 'should proxy underscore methods', ->

    fixture = require './proxy-underscore.json'

    collection = new Collection 'x', fixture.models

    foo = collection.filter readonly: yes
    foo.should.have.lengthOf 1
    foo[0].name.should.eql 'x'

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

  it 'should throw readonly dups', ->

    fixture = [
      { name: 'a', binding: [ [ 'a+b' ], [ 'c+d' ] ] }
      { name: 'b', binding: [ [ 'c+d' ], [ 'a+b' ] ], 'readonly': true }
      { name: 'c', binding: [ [ 'b+a' ] ], 'readonly': true }
    ]

    collection = new Collection 'x'
    collection.add fixture[0]
    collection.add fixture[1]
    collection.add.bind(collection, (fixture[2])).should.throw /dup/

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
