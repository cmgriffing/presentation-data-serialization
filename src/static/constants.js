const FORMATS = {
  PROTOBUF: 'protobuf',
  MSGPACK: 'msgpack',
  AVRO: 'avro',
  //BENCODE: 'bencode',
  BSON: 'bson',
  JSON: 'json',
  //XML: 'xml',
}

const FORMATS_ARRAY = Object.entries(FORMATS).map((entry) => {
  return entry[1];
});



const _exports = {
  FORMATS,
  FORMATS_ARRAY,
};


if(typeof window !== 'undefined') {
  window.CONSTANTS = _exports;
} else {
  module.exports = _exports;
}
