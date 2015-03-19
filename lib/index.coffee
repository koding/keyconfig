Collection = require './collection'
inherits_  = require 'inherits-underscore'
events     = require 'events'

module.exports =

class Keyconfig extends events.EventEmitter

  inherits_ Keyconfig::

  constructor: (defaults={}) ->

    @models = []
    (@add name, models for name, models of defaults)

    super()


  add: (name, models) ->
    collection = new Collection name, models
    collection.on 'change', (model) =>
      @emit 'change', collection, model

    @models.push collection
