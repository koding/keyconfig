# keyconfig

stores shortcut definitions.

# usage

```js
var keyconfig = new Keyconfig({
  x: [ 
    { 
      name: 'foo', 
      binding: [ [ 'ctrl+z' ], [ 'cmd+z' ] ]
    } 
  ]
});

keyconfig.on('change', function (collection, model) { });

keyconfig.find({ name: 'x '}).find({ name: 'foo' }).update({ readonly: true });

```

# spec

Below is an example of a shortcut definition that belongs to `editor` set.

```json
{
  "editor":
  [
    {
      "name": "save",
      "description": "Save",
      "binding": [
        [ "ctrl+s" ],
        [ "command+s" ]
      ],
      "readonly": false
    }
  ]
}
```

### .name

A shortcut must have a unique name within the set it belongs to.

### .description

### .binding

Binding is an array of two arrays which define Windows and OSX key sequences respectively.

### .readonly

When set, keyconfig will throw an error if it encounters a binding collision; otherwise it will omit latter binding and silently resolve the collision.

# api

# keyconfig(collections={})

# Collection(name, models=[])

## .add(model)
## .toJSON()

# Model(value={})

## .update(value={})
## .getWinKeys()
## .getMacKeys()
## .getWinChecksum()
## .getMacChecksum()
## .toJSON()

* `Keyconfig` and `Collection` instances also proxy underscore methods.
* Updating a model triggers `change` event that bubble up.

# license

mit