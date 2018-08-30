# General issues (no order)

# Base (stringifying simple data)

- Everything but msgpack worked with little effort
- dicsovered later: msgpack. cannot stringify data

# 10kb

- bencode. doesnt natively support booleans. They convert to 0 and 1
- formats besides mgpack run into stringification issues. just use arraybuffers instead


# Other

- Avro schema fields are required by default
- Protobuf schema fields are optional by default (seemingly)


# Random thoughts

- Sending data from the browser is not gzipped (without some effort)
- languages other than JS may not have optimized for JSON as much
-