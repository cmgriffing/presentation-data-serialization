const gzipSize = require('gzip-size');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

glob(`${__dirname}/lib/*.js`, (error, files) => {

  const uncompressedResults = [];
  const gzippedResults = [];

  files.map(file => {
    console.log('file', file);

    const pathParts = path.parse(file);


    if(
      pathParts.name.indexOf('d3') === -1 &&
      pathParts.name.indexOf('_common') === -1 &&
      pathParts.name.indexOf('jsdom') === -1 &&
      pathParts.name.indexOf('bundle') === -1 &&
      pathParts.name.indexOf('.schema') === -1
    ) {

      const contents = fs.readFileSync(file);

      uncompressedResults.push({
        format: pathParts.name,
        values: [{
          metric: 'Uncompressed',
          value: contents.length
        }]
      });

      gzippedResults.push({
        format: pathParts.name,
        values: [{
          metric: 'Gzipped',
          value: gzipSize.sync(contents)
        }]
      });

    }

  });

  console.log('uncompressed: ', JSON.stringify(uncompressedResults));
  console.log('gzipped: ', JSON.stringify(gzippedResults));
});
