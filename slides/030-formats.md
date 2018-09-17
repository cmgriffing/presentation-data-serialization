##

<h1>Formats</h1>

## JSON

[https://www.json.org/](https://www.json.org/)

```json
// Example:
{
  "name": "Something",
  "weight": 42,
  "contents": [
    "widgets",
    "cogs"
  ]
}
```

## XML

![](./assets/xml.gif)

[https://w3.org/XML/](https://w3.org/XML/)

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <name>Something</name>
  <weight>42</weight>
  <contents>widgets</contents>
  <contents>cogs</contents>
</root>
```

<div class="notes">
Nobody wants to use XML, but it really is better suited for encoding SVG than anything else.
</div>

## Warning

There be <strike>dragons</strike> binary

The following string representations are only for visualization purposes.

<div class="notes">
The string representations you will see are just that.

It is a utf8 encoding of binary data.

In many cases doing such stringification will corrupt the data.

This is only for visualization purposes.
</div>

## Avro

[https://avro.apache.org/](https://avro.apache.org/)

```
Something(Bwidgetscogs
```

<div class="notes">
- uses a schema
</div>

## Avro Schema

```javascript
const example1K = avro.Type.forSchema({
  type: 'record',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'index', type: 'int' },
    { name: 'guid', type: 'string' },
    { name: 'isActive', type: 'boolean' },
    { name: 'balance', type: 'string' },
    { name: 'picture', type: 'string' },
    { name: 'age', type: 'int' },
    { name: 'eyeColor', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'gender', type: 'string' },
    { name: 'company', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'about', type: 'string' },
    { name: 'registered', type: 'string' },
    { name: 'latitude', type: 'float' },
    { name: 'longitude', type: 'float' },
    { name: 'greeting', type: 'string' },
    { name: 'favoriteFruit', type: 'string' },
    { name: 'tags', type: {type: 'array', items: 'string'} },
    {
      name: 'friends',
      type: {
        type: 'array',
        items: {
          type: 'record',
          fields: [
            { name: 'id', type: 'int'},
            { name: 'name', type: 'string'},
          ]
        }
      }
    },
  ]
});
```

## Avro Schema (contd.)

```javascript
const exampleArraySchema = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'data',
      type: {
        type: 'array',
        items: exampleSchema
      }
    }
  ],
});
```

<div class="notes">
- schemas are composable by instance
</div>

## Bencode

[https://en.wikipedia.org/wiki/Bencode](https://en.wikipedia.org/wiki/Bencode)

- Pronounced "B-encode"
- Used by the Bittorrent protocol

```
d8:contentsl7:widgets4:cogse4:name9:Something6:weighti42ee
```

<div class="notes">
- Does not natively support boolean values,
- Could cause data corruption,
- Converts booleans to 0s and 1s.
</div>

## BSON

[http://bsonspec.org/](http://bsonspec.org/)

- Used by MongoDB
- Pronounced [bee · sahn]
- Stands for "Binary JSON"

```
Oname
Somethingweight*contents 0widgets1cogs
```

<div class="notes">
The bsonspec.org site is somewhat old school.
</div>

## MessagePack

[https://msgpack.org/index.html](https://msgpack.org/index.html)

```
��name�Something�weight*�contents��widgets�cogs
```

<div class="notes">
Small integers are encoded into a single byte, and typical short strings require only one extra byte in addition to the strings themselves.
</div>

## Protobuf

[https://developers.google.com/protocol-buffers/](https://developers.google.com/protocol-buffers/)

- By Google

```
Something(Bwidgetscogs
```

<div class="notes">
- uses a schema
- excels with numerical data

There is not much documentation on the json flavor of scheme definition.

With JSON as a config format, using nested data types requires they be defined within the same nested scope.
</div>

## Protobuf Schema (proto)

```go
syntax = "proto3";

message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
}
```

<div class="notes">
I did not use proto files.
</div>

## Protobuff Schema (json)

```javascript
const root = protobuf.Root.fromJSON({
  nested: {
    Friend: {
      fields: {
        id: {
          type: 'int32',
          id: 1,
        },
        name: {
          type: 'string',
          id: 2,
        },
      }
    },
    Example: {
      fields: {
        // Primary
        id: {
          type: 'string',
          id: 1,
        },
        index: {
          type: 'int32',
          id: 2,
        },
        guid: {
          type: 'string',
          id: 3,
        },
        // Non-Primary
        isActive: {
          type: 'bool',
          id: 20,
        },
        balance: {
          type: 'string',
          id: 21,
        },
        picture: {
          type: 'string',
          id: 22,
        },
        age: {
          type: 'int32',
          id: 23,
        },
        eyeColor: {
          type: 'string',
          id: 24,
        },
        name: {
          type: 'string',
          id: 25,
        },
        gender: {
          type: 'string',
          id: 26,
        },
        company: {
          type: 'string',
          id: 27,
        },
        email: {
          type: 'string',
          id: 28,
        },
        phone: {
          type: 'string',
          id: 29,
        },
        address: {
          type: 'string',
          id: 30,
        },
        about: {
          type: 'string',
          id: 31,
        },
        registered: {
          type: 'string',
          id: 32,
        },
        latitude: {
          type: 'float',
          id: 33,
        },
        longitude: {
          type: 'float',
          id: 34,
        },
        tags: {
          type: 'string',
          id: 35,
          rule: 'repeated'
        },
        friends: {
          id: 36,
          rule: 'repeated',
          type: 'Friend'
        },
        greeting: {
          type: 'string',
          id: 37,
        },
        favoriteFruit: {
          type: 'string',
          id: 38,
        },
      }
    },
    Examples: {
      fields: {
        data: {
          type: 'Example',
          id: 1,
          rule: 'repeated'
        }
      }
    }
  }
});
```

<div class="notes">
JSON format is not documented very well.

I had to guess at how the nesting worked.

</div>

## Others (unimplemented here)

- Flatbuffers
- Thrift
- YAML
- SOAP

<div class="notes">

- Flatbuffers required doing a local build via CMAKE.
  - One important thing is that you can operate upon a FlatBuffer without deserializing it from its underlying arrayBuffer.

- Thrift bares too many similarities to Protobuf with no discernible benefits

- YAML is YAML

- SOAP is almost always going to be asked about. SOAP is just a superset of XML (read: worse XML) and is more of a protocol than a serialization format

</div>

---
