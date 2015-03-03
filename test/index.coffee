Keyconfig = require '../lib'

describe 'Keyconfig', ->

  it 'should proxy underscore methods', ->
    
    fixture = require './proxy-underscore.json'

    bar = new Keyconfig fixture.collections
    baz = bar.filter name: 'y'
    
    baz.should.have.lengthOf 1
    baz[0].name.should.eql 'y'
