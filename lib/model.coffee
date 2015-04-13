events   = require 'events'
defined  = require 'defined'
_        = require 'lodash'
checksum = require 'keycode-checksum'
checksum = _.memoize checksum

module.exports =

class Model extends events.EventEmitter

  constructor: (value={}) ->

    throw new Error 'missing name'  unless value.name

    @name = value.name

    @update value

    super()


  update: (value, silent=no) ->

    @binding = defined value.binding, @binding
    @binding = [].concat(@binding)[..1]
    @options = defined @options
    @description = defined value.description, @description, null

    if _.isObject value.options
      @options = _.extend {}, @options, value.options

    @binding.push null  while @binding.length < 2
    @binding = @binding.map (seq) -> _.uniq [].concat(seq).filter(Boolean)

    @emit 'change' unless silent
    return this


  toJSON: ->

    name        : @name
    description : @description
    binding     : @binding
    options     : @options

  getWinKeys: -> @binding[0]
  getMacKeys: -> @binding[1]

  getWinChecksum: -> checksum @binding[0]
  getMacChecksum: -> checksum @binding[1]