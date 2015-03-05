Keyconfig = require '../lib'

describe 'Keyconfig', ->

  it 'should proxy underscore methods', ->
    
    fixture = require './proxy-underscore.json'

    bar = new Keyconfig fixture.collections
    baz = bar.filter name: 'y'
    
    baz.should.have.lengthOf 1
    baz[0].name.should.eql 'y'

  it 'should emit change', (done) ->

    foo = new Keyconfig
      x: [
        { name: 'qux' }
        { name: 'quux', binding: [ ['e+f'], null ] }
      ]

    x = foo.filter name: 'x'
    qux = x[0].filter name: 'qux'
    
    foo.once 'change', (collection, model) ->
      model.readonly.should.eql yes
    
    qux[0].readonly.should.eql no
    qux[0].update readonly: true

    foo.once 'change', (collection, model) ->
      model.getWinKeys().should.eql ['e+f']
      model.getMacKeys().should.eql ['z+q', 'e+f']
      quux[0].getMacChecksum().should.have.lengthOf 2
      done()
    
    quux = x[0].filter name: 'quux'
    quux[0].getMacChecksum().should.have.lengthOf 0
    quux[0].update binding: [ ['e+f'], ['z+q', 'e+f'] ]




