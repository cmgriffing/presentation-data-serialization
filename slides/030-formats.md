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

<div class="notes">
Nobody wants to use XML, but it really is better suited for encoding SVG than anything else.
</div>

## Avro

[https://avro.apache.org/](https://avro.apache.org/)

- Relies on schemas.
- Rich data structures.
- A compact, fast, binary data format.

```
// Example:
Something(Bwidgetscogs
```

<div class="notes">
The schema is interesting because they are composable using the instances of the schemas.
</div>

## Bencode

[https://en.wikipedia.org/wiki/Bencode](https://en.wikipedia.org/wiki/Bencode)

- Pronounced "B-encode"
- Used by the Bittorrent protocol

```
// Example:
d8:contentsl7:widgets4:cogse4:name9:Something6:weighti42ee
```

<div class="notes">
Does not natively support boolean values, so it could cause data corruption, since it converts booleans to 0s and 1s.
</div>

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

<div class="notes">
The bsonspec.org site is somewhat old school.
</div>

## MessagePack

[https://msgpack.org/index.html](https://msgpack.org/index.html)

- language-neutral
- platform-neutral
- extensible

```
// Example:
��name�Something�weight*�contents��widgets�cogs
```

<div clas="notes">
Small integers are encoded into a single byte, and typical short strings require only one extra byte in addition to the strings themselves.
</div>

## Protobuf

[https://developers.google.com/protocol-buffers/](https://developers.google.com/protocol-buffers/)

- By Google
- Uses schemas

```
// Example:
Something(Bwidgetscogs
```

<div class="notes">
There is not much documentation on the json flavor of scheme definition.

With JSON as a config format, using nested data types requires they be defined within the same nested scope.
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
