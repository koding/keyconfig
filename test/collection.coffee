Collection = require '../lib/collection'
checksum = require 'keycode-checksum'

describe 'Collection', ->

  it 'should proxy underscore methods', ->
    
    fixture = require './proxy-underscore.json'

    collection = new Collection 'x', fixture.models

    foo = collection.filter readonly: yes
    foo.should.have.lengthOf 1
    foo[0].name.should.eql 'x'

  it 'should omit dups', ->
    
    fixture = require './omit-dups.json'

    collection = new Collection 'x', fixture.collection
    collection.models[2].binding.should.eql [[ 'z+x' ], [] ]
    collection.models[2].getWinChecksum().should.have.lengthOf 1
    collection.models[2].getMacChecksum().should.have.lengthOf 0
    collection.models[2].getWinChecksum().should.eql checksum ['x+z']

  it 'should throw readonly dups', ->

    fixture = require './throw-readonly-dups.json'

    collection = new Collection 'x'
    collection.add fixture.models[0]
    collection.add fixture.models[1]

    collection.add.bind(collection, (fixture.models[2])).should.throw /dup/
