Model = require '../lib/model'

describe 'Model', ->

  it 'should have options property set no matter what', ->

    model = new Model name: 'x'
    model.should.have.property 'options'
    (typeof model.options).should.eql('undefined')

  it 'should extend options when updating', ->

    model = new Model name: 'x'

    model.update options: a: 555
      .should.have.property('options')

    model.options.should.have.property 'a'
    model.options.a.should.eql 555

    model.update options: b: 666

    model.options.should.have.property 'a'
    model.options.a.should.eql 555

    model.options.should.have.property 'b'
    model.options.b.should.eql 666

    model.update options: a: 333
    model.options.a.should.eql 333
    model.options.b.should.eql 666
