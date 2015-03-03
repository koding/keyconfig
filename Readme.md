# keyconfig

stores shortcut configuration sets.

```
npm i keyconfig 
```

# spec

A configuration object has keymap sets (`Collection`) defined at top-level which each of them includes keymap (`Model`) definitions.

```json
{
  "editor": [...],
  "terminal": [...]
}
```

Below is an example of a keymap definition:

```json
{
  "name": "save",
  "description": "Save",
  "binding": [
    [ "ctrl+s" ],
    [ "command+s" ]
  ],
  "readonly": false
}
```

### .name

A keymap must have a unique name within the set it belongs to.

### .description

A keymap must provide a description property, but this is optional indeed since not all key bindings are going to be displayed in ui. In that case make sure you have passed `null` instead of an empty string or not defining it at all, and make sure you have set `hidden` true.

### .binding

Binding is an array of two arrays which define Windows and OSX key-sequences respectively. A keymap must have a binding property even if it doesn't have its defaults defined. In that case make sure you have passed `null` (eg `"binding": [null, ["ctrl+z"]]`)

### .readonly

If a keymap is set as read-only, keyconfig will throw an error if it finds a collision within the collection it belongs to. (default: `false`)

# api

# Keyconfig(defaults={})

Proxies [underscore](http://underscorejs.org) methods.

# Collection(name, models=[])

- `.add(model)`
- `.toJSON()`

Proxies [underscore](http://underscorejs.org) methods.

# Model(opts={})

- `.update(value={})`
- `.getWinKeys()`
- `.getMacKeys()`
- `.getWinChecksum()`
- `.getMacChecksum()`
- `.toJSON()`

# events

- `update`

# license

mit