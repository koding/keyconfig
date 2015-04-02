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

    @description = defined value.description, @description, null
    @binding     = defined value.binding, @binding
    @binding     = [].concat(@binding)[..1]
    @readonly    = defined value.readonly, @readonly, false
    @options     = defined @options

    if 'object' is typeof value.options
      @options = _.extend {}, @options, value.options

    @binding.push null  while @binding.length < 2

    @binding = @binding.map (x) ->
      return _.uniq [].concat(x).filter(Boolean)

    @emit 'change' unless silent

    return this


  toJSON: ->

    name        : @name
    description : @description
    binding     : @binding
    readonly    : @readonly
    options     : @options


  getWinKeys:     -> @binding[0]

  getMacKeys:     -> @binding[1]


  getWinChecksum: -> checksum @binding[0]

  getMacChecksum: -> checksum @binding[1]