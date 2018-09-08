const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const gzipSize = require('gzip-size');

const transforms = require('./static/transforms');

let postCounter = 0;
const uncompressed10KSizes = {};
const uncompressed100KSizes = {};
const gzipped10KSizes = {};
const gzipped100KSizes = {};

app.use(bodyParser.raw({
  type: '*/*',
  limit: '50MB',
  level: 9,
}));

app.use(function(req, res, next) {
  if(req.method === 'POST' && req.body) {
    postCounter++;
    const format = req.get('Serialization-Format');

    if(!uncompressed100KSizes[format]) {
      uncompressed10KSizes[format] = {
        format: format,
        values: []
      };
      uncompressed100KSizes[format] = {
        format: format,
        values: []
      };
      gzipped10KSizes[format] = {
        format: format,
        values: []
      };
      gzipped100KSizes[format] = {
        format: format,
        values: []
      };
    }

    const contentLength = req.get('Content-Length');
    if(contentLength < 20000) {
      uncompressed10KSizes[format].values[0] = {
        metric: `10K`,
        value: +req.get('Content-Length')
      };
      gzipped10KSizes[format].values[0] = {
        metric: `10K`,
        value: gzipSize.sync(req.body)
      };
    } else {
      uncompressed100KSizes[format].values[0] = {
        metric: `100K`,
        value: +req.get('Content-Length')
      };
      gzipped100KSizes[format].values[0] = {
        metric: `100K`,
        value: gzipSize.sync(req.body)
      };
    }


    if(postCounter % 10 === 0) {
      console.log(JSON.stringify(Object.values(uncompressed10KSizes)));
      console.log(JSON.stringify(Object.values(uncompressed100KSizes)));
      console.log(JSON.stringify(Object.values(gzipped10KSizes)));
      console.log(JSON.stringify(Object.values(gzipped100KSizes)));
    }
  }
  next();
});

app.use(compression({
  filter: function() {
    return true;
  }
}));

app.use(express.static(`${__dirname}/static/`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/static/index.html`);
});

app.post('/api/shipment', async (req, res) => {
  const format = req.get('Serialization-Format');
  const shipment = await transforms['request'][format](req.body);
  const responseBody = await transforms['response'][format](shipment);
  res.send(responseBody);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));