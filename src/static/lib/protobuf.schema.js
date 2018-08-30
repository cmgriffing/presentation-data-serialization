const protobuf = require('protobufjs/light');

const exampleBase = protobuf.Root.fromJSON({
  "nested": {
    "Shipment": {
      "fields": {
        "name": {
          "type": "string",
          "id": 1
        },
        "weight": {
          "type": "float",
          "id": 2
        },
        "contents": {
          "type": "string",
          "id": 3,
          "rule": "repeated"
        }
      }
    }
  }
}).lookupType('Shipment');

const root = protobuf.Root.fromJSON({
  nested: {
    Friend: {
      fields: {
        id: {
          type: 'int32',
          id: 1,
        },
        name: {
          type: 'string',
          id: 2,
        },
      }
    },
    Example: {
      fields: {
        // Primary
        id: {
          type: 'string',
          id: 1,
        },
        index: {
          type: 'int32',
          id: 2,
        },
        guid: {
          type: 'string',
          id: 3,
        },
        // Non-Primary
        isActive: {
          type: 'bool',
          id: 20,
        },
        balance: {
          type: 'string',
          id: 21,
        },
        picture: {
          type: 'string',
          id: 22,
        },
        age: {
          type: 'int32',
          id: 23,
        },
        eyeColor: {
          type: 'string',
          id: 24,
        },
        name: {
          type: 'string',
          id: 25,
        },
        gender: {
          type: 'string',
          id: 26,
        },
        company: {
          type: 'string',
          id: 27,
        },
        email: {
          type: 'string',
          id: 28,
        },
        phone: {
          type: 'string',
          id: 29,
        },
        address: {
          type: 'string',
          id: 30,
        },
        about: {
          type: 'string',
          id: 31,
        },
        registered: {
          type: 'string',
          id: 32,
        },
        latitude: {
          type: 'float',
          id: 33,
        },
        longitude: {
          type: 'float',
          id: 34,
        },
        tags: {
          type: 'string',
          id: 35,
          rule: 'repeated'
        },
        friends: {
          id: 36,
          rule: 'repeated',
          type: 'Friend'
        },
        greeting: {
          type: 'string',
          id: 37,
        },
        favoriteFruit: {
          type: 'string',
          id: 38,
        },
      }
    },
    Examples: {
      fields: {
        data: {
          type: 'Example',
          id: 1,
          rule: 'repeated'
        }
      }
    }
  }
});

const example1K = root.lookupType('Example');

const example10K = root.lookupType('Examples');

module.exports = {
  exampleBase,
  example1K,
  example10K,
};
