Collection = require './collection'
inherits_  = require 'inherits-underscore'
events     = require 'events'

module.exports =

class Keyconfig extends events.EventEmitter

  inherits_ Keyconfig::

  constructor: (defaults) ->
    @models = (new Collection name, models for name, models of defaults)
