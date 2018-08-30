const avro = require('avsc/etc/browser/avsc-types');

const exampleBase = avro.Type.forSchema({
  type: 'record',
  fields: [
    { name: 'name', type: 'string'},
    { name: 'weight', type: 'float' },
    { name: 'contents', type: { type: 'array', 'items': 'string' } }
  ]
});

const example1K = avro.Type.forSchema({
  type: 'record',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'index', type: 'int' },
    { name: 'guid', type: 'string' },
    { name: 'isActive', type: 'boolean' },
    { name: 'balance', type: 'string' },
    { name: 'picture', type: 'string' },
    { name: 'age', type: 'int' },
    { name: 'eyeColor', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'gender', type: 'string' },
    { name: 'company', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'about', type: 'string' },
    { name: 'registered', type: 'string' },
    { name: 'latitude', type: 'float' },
    { name: 'longitude', type: 'float' },
    { name: 'greeting', type: 'string' },
    { name: 'favoriteFruit', type: 'string' },
    { name: 'tags', type: {type: 'array', items: 'string'} },
    {
      name: 'friends',
      type: {
        type: 'array',
        items: {
          type: 'record',
          fields: [
            { name: 'id', type: 'int'},
            { name: 'name', type: 'string'},
          ]
        }
      }
    },
  ]
});

const example10K = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'data',
      type: {
        type: 'array',
        items: example1K
      }
    }
  ],
});

module.exports = {
  exampleBase,
  example1K,
  example10K,
};
