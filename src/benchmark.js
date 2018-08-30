const avro = require('avsc');
const xmljs = require('xml-js');
const bencode = require('bencode');
const BSON = require('bson');
const msgpack = require('msgpack-lite');

const protoSchema = require('./static/lib/protobuf.schema');

const avroSchemaWrapper = require('./static/lib/avro.schema');

const Benchmark = require('benchmark');

const { FORMATS_ARRAY } = require('./static/constants');
const transforms = require('./static/transforms');
const ExampleData1K = require('./static/example-data-1k');
const ExampleData10K = require('./static/example-data-10k');
const ExampleData100K = require('./static/example-data-100k');

const dataArray = [
  // {
  //   name: '1K',
  //   data: ExampleData1K
  // },
  {
    name: '10K',
    data: ExampleData10K
  },
  {
    name: '100K',
    data: ExampleData100K
  },
];

const encodeSuite = new Benchmark.Suite();
const decodeSuite = new Benchmark.Suite();

const resultsMap = {};
FORMATS_ARRAY.map(format => {
  dataArray.map(dataset => {
    encodeSuite.add(`${format} Encode ${dataset.name}`, {
      defer: true,
      fn: async function(deferred) {
        const hashKey = format + dataset.name;
        const result = await transforms['response'][format](dataset.data);
        if(!resultsMap[hashKey]) {
          resultsMap[hashKey] = result;
        }
        deferred.resolve(result);
      },
      // onCycle: console.log,
      onComplete: function(result) {
        handleOnComplete(format, dataset, result);
      }
    });
    decodeSuite.add(`${format} Decode ${dataset.name}`, {
      defer: true,
      fn: async function(deferred) {
        const hashKey = format + dataset.name;
        const buffer = resultsMap[hashKey];
        const result = await transforms['request'][format](buffer);
        deferred.resolve(result);
      },
      // onCycle: console.log,
      onComplete: function(event) {
        handleOnComplete(format, dataset, event);
      }
    });
  });
});

encodeSuite.on('complete', function() {
  console.log('Fastest is ', this.filter('fastest')['0'].name);

  decodeSuite.run({
    async: true
  });
});

decodeSuite.on('complete', function() {
  console.log('Fastest is ', this.filter('fastest')['0'].name);
});

encodeSuite.run({
  async: true
});


function handleOnComplete(format, dataset, event) {
  console.log(format, dataset.name, event.target.times);
}