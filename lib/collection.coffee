events    = require 'events'
inherits_ = require 'inherits-underscore'
Model     = require './model'
_ = require 'lodash'

module.exports =

class Collection extends events.EventEmitter

  inherits_ Collection::

  constructor: (name, models) ->

    throw new Error 'missing name'  unless name

    @name = name
    @models = []
    [].concat(models).filter(Boolean).forEach (model) =>
      @add model

    super()


  _getColliding: (platform) ->

    sumMethodName = "get#{platform}Checksum"

    groups = {}

    @each (model) ->
      sums = model[sumMethodName]()
      sums.forEach (sum) ->
        groups[sum] = [].concat(groups[sum]).filter(Boolean).concat model

    _.filter groups, (group) ->
      group.length > 1


  getCollidingWin: -> @_getColliding 'Win'

  getCollidingMac: -> @_getColliding 'Mac'


  add: (model) ->

    model = new Model model  unless model instanceof Model

    exists = @find name: model.name
    throw 'dup' if exists

    model.on 'change', => @emit 'change', model
    @models.push model

    return this


  update: (name, value={}, silent=no) ->

    model = @find name: name
    throw new Error "#{name} not found" unless model instanceof Model
    model.update value
    return this


  toJSON: -> @map (model) -> model.toJSON()
