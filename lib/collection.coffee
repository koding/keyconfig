events    = require 'events'
inherits_ = require 'inherits-underscore'
Model     = require './model'

module.exports =

class Collection extends events.EventEmitter

  inherits_ Collection::

  constructor: (name, models) ->

    throw new Error 'missing name'  unless name

    @name   = name
    @models = []

    [].concat(models).filter(Boolean).forEach (x) =>
      @add x

    super()


  _stripCollidingBindings: (model, platform) ->

    # This method *throws if given model is readonly* and one of its bindings is
    # already defined in this collection.
    # *Otherwise it returns valid keys* for the given platform.

    sumMethodName  = "get#{platform}Checksum"
    keysMethodName = "get#{platform}Keys"

    list = @chain()
      .reject name: model.name
      .invoke(sumMethodName)
      .flatten()
      .without(undefined, null)

    checksum = model[sumMethodName]()

    collisions = list.intersection(checksum).value()

    keys = model[keysMethodName]()

    if collisions.length

      if model.readonly then throw new Error "dup: #{model.name}"
      else
        collisions = collisions.map (x) ->
          return checksum.indexOf x

        keys = keys.filter (x, i) ->
          return !~collisions.indexOf i

        return keys

    return keys


  _validateBindings: (model) ->

    return ['Win', 'Mac'].map (platform) =>
      @_stripCollidingBindings model, platform


  add: (model) ->

    model = new Model model  unless model instanceof Model
    model
      .on 'change', =>
        @emit 'change', model
      .update binding: @_validateBindings(model), yes

    @models.push model

    return this


  update: (name, value={}, silent=no) ->

    # updates a model in this collection, not the collection itself

    model = @find name: name
    throw new Error "#{name} not found" unless model instanceof Model

    model
      .update value, yes
      .update binding: @_validateBindings(model), silent

    return this


  toJSON: ->

    return this.map (x) -> return x.toJSON()
