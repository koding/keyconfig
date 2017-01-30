Model = require '../lib/model'
assert = require 'assert'

describe 'Model', ->

  it 'should have options property set no matter what', ->

    model = new Model name: 'x'
    assert.equal 'undefined', typeof model.options

  it 'should extend options when updating', ->

    model = new Model name: 'x'

    model.update options: a: 555

    assert.equal model.options.a, 555

    model.update options: b: 666
    assert.equal model.options.a, 555
    assert.equal model.options.b, 666

    model.update options: a: 333
    assert.equal model.options.a, 333
    assert.equal model.options.b, 666
