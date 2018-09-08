const jsdom = require('jsdom');
const d3 = require('d3');
const fs = require('fs');
const path = require('path');

const Benchmark = require('benchmark');

const { FORMATS_ARRAY } = require('./constants');
const transforms = require('./transforms');
const ExampleData1K = require('./example-data-1k');
const ExampleData10K = require('./example-data-10k');
const ExampleData100K = require('./example-data-100k');

const runBenchmarks = require('./benchmarks');

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

runBenchmarks({
  FORMATS_ARRAY,
  dataArray,
  transforms,
  encodeSuite,
  decodeSuite,
}, {
  d3,
  jsdom,
}).then(results => {
  results.map(result => {
    fs.writeFileSync(path.resolve(`server-${__dirname}/${result.fileName}.svg`), result.graph)
  });
});