events   = require 'events'
checksum = require 'keycode-checksum'
xtend    = require 'xtend'
defined  = require 'defined'
nub      = require 'nub'

module.exports =

class Model extends events.EventEmitter

  constructor: (opts={}) ->

    throw new Error 'missing name'  unless opts.name

    @name = opts.name
    @update opts

    super()


  update: (opts) ->

    @description = defined opts.description, @description, null
    @binding     = defined opts.binding, @binding
    @binding     = [].concat(@binding).filter(Boolean)
    @enabled     = defined opts.enabled, @enabled, true
    @readonly    = defined opts.readonly, @readonly, false
    @hidden      = defined opts.hidden, @hidden, false

    @binding.push null  while @binding.length < 2

    @binding = @binding.map (x) ->
      return nub [].concat(x).filter(Boolean)

    @emit 'change'

    return this


  toJSON: ->
    name        : @name
    description : @description
    binding     : @binding
    enabled     : @enabled
    readonly    : @readonly
    hidden      : @hidden

  getWinKeys:     -> @binding[0]
  getMacKeys:     -> @binding[1]

  # XXX: cache
  getWinChecksum: -> checksum @binding[0]
  getMacChecksum: -> checksum @binding[1]