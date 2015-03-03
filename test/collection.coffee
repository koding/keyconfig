fixture = require './proxy-underscore.json'
Collection = require '../lib/collection'
Keyconfig = require '../lib'

describe 'Collection', ->

  it 'should proxy to underscore', () ->
    
    collection = new Collection 'x', fixture.models

    foo = collection.filter readonly: yes
    foo.should.have.lengthOf 1
    foo[0].name.should.eql 'x'

    bar = new Keyconfig fixture.collections
    baz = bar.filter name: 'y'
    
    baz.should.have.lengthOf 1
    baz[0].name.should.eql 'y'