const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

const transforms = require('./static/transforms');

app.use(bodyParser.raw({
  type: '*/*',
  limit: '50MB',
  level: 9,
}));

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