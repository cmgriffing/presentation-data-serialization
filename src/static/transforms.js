const xmljs = require('xml-js');
const bencode = require('bencode');
const BSON = require('bson');
const msgpack = require('msgpack-lite');
const protoSchema = require('./lib/protobuf.schema');
const avroSchemaWrapper = require('./lib/avro.schema');

// Setup
const avroSchema = avroSchemaWrapper.example10K;

const bson = new BSON();

const proto = protoSchema.example10K;

// Transformers

function transformAvroRequest(requestBody) {
  return avroSchema.fromBuffer(requestBody);
}

function transformAvroResponse(responseBody) {
  return avroSchema.toBuffer(responseBody);
}

function transformJsonRequest(requestBody) {
  let body = requestBody;
  if(body.toString) {
    body = body.toString();
  }
  return JSON.parse(body);
}

function transformXmlRequest(requestBody) {
  return new Promise((resolve, reject) => {
    let body = requestBody;
    if(body.toString) {
      body = body.toString();
    }

    resolve(xmljs.xml2js(`<data>${body}</data>`, {
      //compact: typeof window === 'undefined'
    }));
  })

}

function transformXmlResponse(responseBody) {
  return xmljs.js2xml(responseBody.data, {
      //compact: typeof window === 'undefined'
  });
}

function transformBencodeRequest(requestBody) {
  let body = requestBody;
  if(body.toString) {
    body = body.toString();
  }
  return bencode.decode(body, 'utf8');
}

function transformBencodeResponse(responseBody) {
  return bencode.encode(responseBody);
}

function transformBsonRequest(requestBody) {
  return bson.deserialize(requestBody, {
    allowObjectSmallerThanBufferSize: true
  });
}

function transformBsonResponse(responseBody) {
  return bson.serialize(responseBody);
}

function transformMsgpackRequest(requestBody) {
  return msgpack.decode(requestBody);
}

function transformMsgpackResponse(responseBody) {
  return msgpack.encode(responseBody);
}

function transformProtobufRequest(requestBody) {
  return proto.decode(requestBody);
}

function transformProtobufResponse(responseBody) {
  return proto.encode(proto.create(responseBody)).finish();
}

const _exports = {
  request: {
    avro: transformAvroRequest,
    json: transformJsonRequest,
    xml: transformXmlRequest,
    bencode: transformBencodeRequest,
    bson: transformBsonRequest,
    msgpack: transformMsgpackRequest,
    protobuf: transformProtobufRequest,
  },
  response: {
    avro: transformAvroResponse,
    json: JSON.stringify,
    xml: transformXmlResponse,
    bencode: transformBencodeResponse,
    bson: transformBsonResponse,
    msgpack: transformMsgpackResponse,
    protobuf: transformProtobufResponse,
  }
};

try {
  window.transforms = _exports;
} catch(e) {
  module.exports = _exports;
}