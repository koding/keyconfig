events    = require 'events'
inherits_ = require 'inherits-underscore'
Model     = require './model'

module.exports =

class Collection extends events.EventEmitter

  inherits_ Collection::

  constructor: (name, models) ->

    throw new Error 'missing name'  unless name

    @name = name
    @models = []
    
    [].concat(models).filter(Boolean).forEach (x) =>
      @add x

    super()

  
  _findCollisions: (model, platform) ->

    methodName = "get#{platform}Checksum"

    list = @chain().invoke(methodName).flatten().without(undefined, null)

    checksum = model[methodName]()
    collisions = list.intersection(checksum).value()

    if collisions.length
      if model.readonly then  throw new Error  "dup: #{model.name}"
      else
        collisions = collisions.map (x) ->
          return checksum.indexOf x

        binding = model.binding

        ix = if platform is 'Win' then 0 else 1
        binding[ix] = binding[ix].filter (x, i) ->
          return !~collisions.indexOf i

        model.update binding: binding

      return model


  _validate: (model) ->
    
    @_findCollisions model, 'Win'
    @_findCollisions model, 'Mac'

    return model

  
  add: (model) ->

    model = new Model model  unless model instanceof Model
    @models.push(@_validate model)

    return this

  
  toJSON: ->
    return this.map (x) -> return x.toJSON()
