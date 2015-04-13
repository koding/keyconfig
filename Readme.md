# keyconfig

stores keyboard shortcut definitions.

# usage

```js
var keyconfig = new Keyconfig({
  x: [ 
    { 
      name: 'foo', 
      binding: [ [ 'ctrl+z' ], [ 'command+z' ] ]
    } 
  ]
});

keyconfig
  .on('change', function (collection, model) { });
  .find({ name: 'x '})
  .find({ name: 'foo' })
  .update({ binding: ['command+d'] });
```

# spec

Below is an example of a collection:

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
      "options": {
        "enabled": true
      }
    }
  ]
}
```

### fields

- `name` must be unique
- `binding` is an array of two arrays that defines win and mac shortcuts respectively
- `description` is description text
- `options` is always extended when you do `update`

# api

# keyconfig(collections={})

# Collection(name, models=[])

## .add(model)
## .toJSON()

`Keyconfig` and `Collection` instances also proxy underscore methods.

# Model(value={})

## .update(value={})
## .getWinKeys()
## .getMacKeys()
## .getWinChecksum()
## .getMacChecksum()
## .toJSON()

Updating a model triggers a `change` event that bubble up.

# license

mit