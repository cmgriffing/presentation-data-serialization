## Formats

## JSON

[https://www.json.org/](https://www.json.org/)

```
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

```
// Example:
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <name>Something</name>
  <weight>42</weight>
  <contents>widgets</contents>
  <contents>cogs</contents>
</root>
```

## Avro

[https://avro.apache.org/](https://avro.apache.org/)

- Relies on schemas.
- Rich data structures.
- A compact, fast, binary data format.

```
// Example:
Something(Bwidgetscogs
```

## Bencode

[https://en.wikipedia.org/wiki/Bencode](https://en.wikipedia.org/wiki/Bencode)

- Pronounced "B-encode"
- Used by the Bittorrent protocol

```
// Example:
d8:contentsl7:widgets4:cogse4:name9:Something6:weighti42ee
```

## BSON

[http://bsonspec.org/](http://bsonspec.org/)

- Used by MongoDB
- Pronounced [bee · sahn]
- Stands for "Binary JSON"

```
// Example:
Oname
Somethingweight*contents 0widgets1cogs
```

## MessagePack

[https://msgpack.org/index.html](https://msgpack.org/index.html)

- language-neutral
- platform-neutral
- extensible

```
// Example:
��name�Something�weight*�contents��widgets�cogs
```

## Protobuf

[https://developers.google.com/protocol-buffers/](https://developers.google.com/protocol-buffers/)

- By Google
- Uses schemas

```
// Example:
Something(Bwidgetscogs
```

## Others (unimplemented here)

- Flatbuffers
- Thrift
- YAML
- SOAP

<div class="notes">

- Flatbuffers required doing a local build via CMAKE.

- Thrift bares too many similarities to Protobuf

- YAML is YAML

- SOAP is just a superset of XML (read: worse XML) and is more of a protocol than a serialization format

</div>

---
