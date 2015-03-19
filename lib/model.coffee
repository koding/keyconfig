events   = require 'events'
checksum = require 'keycode-checksum'
xtend    = require 'xtend'
defined  = require 'defined'
nub      = require 'nub'

module.exports =

class Model extends events.EventEmitter

  constructor: (value={}) ->

    throw new Error 'missing name'  unless value.name

    @name = value.name
    @update value

    super()


  update: (value) ->

    @description = defined value.description, @description, null
    @binding     = defined value.binding, @binding
    @binding     = [].concat(@binding)[..1]
    @readonly    = defined value.readonly, @readonly, false
    @options     = defined value.options, @options

    @binding.push null  while @binding.length < 2

    @binding = @binding.map (x) ->
      return nub [].concat(x).filter(Boolean)

    @emit 'change'

    return this


  toJSON: ->

    name        : @name
    description : @description
    binding     : @binding
    readonly    : @readonly
    options     : @options


  getWinKeys:     -> @binding[0]

  getMacKeys:     -> @binding[1]


  # XXX: cache

  getWinChecksum: -> checksum @binding[0]

  getMacChecksum: -> checksum @binding[1]