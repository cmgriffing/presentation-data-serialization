(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* jshint browserify: true */

'use strict';

/**
 * Optional entry point for browser builds.
 *
 * To use it: `require('avsc/etc/browser/avsc-types')`.
 */

var types = require('../../lib/types');


/** Basic parse method, only supporting JSON parsing. */
function parse(any, opts) {
  var schema;
  if (typeof any == 'string') {
    try {
      schema = JSON.parse(any);
    } catch (err) {
      schema = any;
    }
  } else {
    schema = any;
  }
  return types.Type.forSchema(schema, opts);
}


module.exports = {
  Type: types.Type,
  parse: parse,
  types: types.builtins,
  // Deprecated exports (not using `util.deprecate` since it causes stack
  // overflow errors in the browser).
  combine: types.Type.forTypes,
  infer: types.Type.forValue
};

},{"../../lib/types":3}],2:[function(require,module,exports){
(function (Buffer){
/* jshint browserify: true */

'use strict';

/**
 * Shim to enable schema fingerprint computation.
 *
 * MD5 implementation originally from [1], used with permission from the
 * author, and lightly edited.
 *
 * [1] http://www.myersdaily.org/joseph/javascript/md5-text.html
 *
 */

function createHash(algorithm) {
  if (algorithm !== 'md5') {
    throw new Error('only md5 is supported in the browser');
  }
  return new Hash();
}

function Hash() { this.data = undefined; }
Hash.prototype.end = function (data) { this.data = data; };
Hash.prototype.read = function () { return md5(this.data); };

function md5cycle(x, k) {
  var a = x[0], b = x[1], c = x[2], d = x[3];

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17,  606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12,  1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7,  1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7,  1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22,  1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14,  643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9,  38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5,  568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20,  1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14,  1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16,  1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11,  1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4,  681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23,  76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16,  530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10,  1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6,  1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6,  1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21,  1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15,  718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
  var n = s.length,
  state = [1732584193, -271733879, -1732584194, 271733878], i;
  for (i=64; i<=s.length; i+=64) {
    md5cycle(state, md5blk(s.substring(i-64, i)));
  }

  s = s.substring(i-64);
  var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
  for (i=0; i<s.length; i++) {
    tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
  }
  tail[i>>2] |= 0x80 << ((i%4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i=0; i<16; i++) {
      tail[i] = 0;
    }
  }
  tail[14] = n*8;
  md5cycle(state, tail);
  return state;
}

function md5blk(s) {
  var md5blks = [], i;
  for (i=0; i<64; i+=4) {
    md5blks[i>>2] = s.charCodeAt(i) +
      (s.charCodeAt(i+1) << 8) +
      (s.charCodeAt(i+2) << 16) +
      (s.charCodeAt(i+3) << 24);
  }
  return md5blks;
}

function md5(s) {
  var arr = md51(s);
  var buf = new Buffer(16);
  var i;
  for (i = 0; i < 4; i++) {
    buf.writeIntLE(arr[i], i * 4, 4);
  }
  return buf;
}

function add32(a, b) {
  return (a + b) & 0xFFFFFFFF;
}

module.exports = {
  createHash: createHash
};

}).call(this,require("buffer").Buffer)
},{"buffer":6}],3:[function(require,module,exports){
(function (Buffer){
/* jshint node: true */

// TODO: Make it easier to implement custom types. This will likely require
// exposing the `Tap` object, perhaps under another name. Probably worth a
// major release.
// TODO: Allow configuring when to write the size when writing arrays and maps,
// and customizing their block size.
// TODO: Code-generate `compare` and `clone` record and union methods.

'use strict';

/**
 * This module defines all Avro data types and their serialization logic.
 *
 */

var utils = require('./utils'),
    buffer = require('buffer'), // For `SlowBuffer`.
    util = require('util');


// Convenience imports.
var Tap = utils.Tap;
var debug = util.debuglog('avsc:types');
var f = util.format;

// All non-union concrete (i.e. non-logical) Avro types.
var TYPES = {
  'array': ArrayType,
  'boolean': BooleanType,
  'bytes': BytesType,
  'double': DoubleType,
  'enum': EnumType,
  'error': RecordType,
  'fixed': FixedType,
  'float': FloatType,
  'int': IntType,
  'long': LongType,
  'map': MapType,
  'null': NullType,
  'record': RecordType,
  'string': StringType
};

// Valid (field, type, and symbol) name regex.
var NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

// Random generator.
var RANDOM = new utils.Lcg();

// Encoding tap (shared for performance).
var TAP = new Tap(new buffer.SlowBuffer(1024));

// Currently active logical type, used for name redirection.
var LOGICAL_TYPE = null;

// Underlying types of logical types currently being instantiated. This is used
// to be able to reference names (i.e. for branches) during instantiation.
var UNDERLYING_TYPES = [];

/**
 * "Abstract" base Avro type.
 *
 * This class' constructor will register any named types to support recursive
 * schemas. All type values are represented in memory similarly to their JSON
 * representation, except for:
 *
 * + `bytes` and `fixed` which are represented as `Buffer`s.
 * + `union`s which will be "unwrapped" unless the `wrapUnions` option is set.
 *
 *  See individual subclasses for details.
 */
function Type(schema, opts) {
  var type;
  if (LOGICAL_TYPE) {
    type = LOGICAL_TYPE;
    UNDERLYING_TYPES.push([LOGICAL_TYPE, this]);
    LOGICAL_TYPE = null;
  } else {
    type = this;
  }

  // Lazily instantiated hash string. It will be generated the first time the
  // type's default fingerprint is computed (for example when using `equals`).
  // We use a mutable object since types are frozen after instantiation.
  this._hash = new Hash();
  this.name = undefined;
  this.aliases = undefined;
  this.doc = (schema && schema.doc) ? '' + schema.doc : undefined;

  if (schema) {
    // This is a complex (i.e. non-primitive) type.
    var name = schema.name;
    var namespace = schema.namespace === undefined ?
      opts && opts.namespace :
      schema.namespace;
    if (name !== undefined) {
      // This isn't an anonymous type.
      name = qualify(name, namespace);
      if (isPrimitive(name)) {
        // Avro doesn't allow redefining primitive names.
        throw new Error(f('cannot rename primitive type: %j', name));
      }
      var registry = opts && opts.registry;
      if (registry) {
        if (registry[name] !== undefined) {
          throw new Error(f('duplicate type name: %s', name));
        }
        registry[name] = type;
      }
    } else if (opts && opts.noAnonymousTypes) {
      throw new Error(f('missing name property in schema: %j', schema));
    }
    this.name = name;
    this.aliases = schema.aliases ?
      schema.aliases.map(function (s) { return qualify(s, namespace); }) :
      [];
  }
}

Type.forSchema = function (schema, opts) {
  opts = opts || {};
  opts.registry = opts.registry || {};

  var UnionType = (function (wrapUnions) {
    if (wrapUnions === true) {
      wrapUnions = 'always';
    } else if (wrapUnions === false) {
      wrapUnions = 'never';
    } else if (wrapUnions === undefined) {
      wrapUnions = 'auto';
    } else if (typeof wrapUnions == 'string') {
      wrapUnions = wrapUnions.toLowerCase();
    }
    switch (wrapUnions) {
      case 'always':
        return WrappedUnionType;
      case 'never':
        return UnwrappedUnionType;
      case 'auto':
        return undefined; // Determined dynamically later on.
      default:
        throw new Error(f('invalid wrap unions option: %j', wrapUnions));
    }
  })(opts.wrapUnions);

  if (schema === null) {
    // Let's be helpful for this common error.
    throw new Error('invalid type: null (did you mean "null"?)');
  }

  if (Type.isType(schema)) {
    return schema;
  }

  var type;
  if (opts.typeHook && (type = opts.typeHook(schema, opts))) {
    if (!Type.isType(type)) {
      throw new Error(f('invalid typehook return value: %j', type));
    }
    return type;
  }

  if (typeof schema == 'string') { // Type reference.
    schema = qualify(schema, opts.namespace);
    type = opts.registry[schema];
    if (type) {
      // Type was already defined, return it.
      return type;
    }
    if (isPrimitive(schema)) {
      // Reference to a primitive type. These are also defined names by default
      // so we create the appropriate type and it to the registry for future
      // reference.
      return opts.registry[schema] = Type.forSchema({type: schema}, opts);
    }
    throw new Error(f('undefined type name: %s', schema));
  }

  if (schema.logicalType && opts.logicalTypes && !LOGICAL_TYPE) {
    var DerivedType = opts.logicalTypes[schema.logicalType];
    if (DerivedType) {
      var namespace = opts.namespace;
      var registry = {};
      Object.keys(opts.registry).forEach(function (key) {
        registry[key] = opts.registry[key];
      });
      try {
        debug('instantiating logical type for %s', schema.logicalType);
        return new DerivedType(schema, opts);
      } catch (err) {
        debug('failed to instantiate logical type for %s', schema.logicalType);
        if (opts.assertLogicalTypes) {
          // The spec mandates that we fall through to the underlying type if
          // the logical type is invalid. We provide this option to ease
          // debugging.
          throw err;
        }
        LOGICAL_TYPE = null;
        opts.namespace = namespace;
        opts.registry = registry;
      }
    }
  }

  if (Array.isArray(schema)) { // Union.
    var types = schema.map(function (obj) {
      return Type.forSchema(obj, opts);
    });
    if (!UnionType) {
      UnionType = isAmbiguous(types) ? WrappedUnionType : UnwrappedUnionType;
    }
    type = new UnionType(types, opts);
  } else { // New type definition.
    type = (function (typeName) {
      var Type = TYPES[typeName];
      if (Type === undefined) {
        throw new Error(f('unknown type: %j', typeName));
      }
      return new Type(schema, opts);
    })(schema.type);
  }
  return type;
};

Type.forValue = function (val, opts) {
  opts = opts || {};

  // Sentinel used when inferring the types of empty arrays.
  opts.emptyArrayType = opts.emptyArrayType || Type.forSchema({
    type: 'array', items: 'null'
  });

  // Optional custom inference hook.
  if (opts.valueHook) {
    var type = opts.valueHook(val, opts);
    if (type !== undefined) {
      if (!Type.isType(type)) {
        throw new Error(f('invalid value hook return value: %j', type));
      }
      return type;
    }
  }

  // Default inference logic.
  switch (typeof val) {
    case 'string':
      return Type.forSchema('string', opts);
    case 'boolean':
      return Type.forSchema('boolean', opts);
    case 'number':
      if ((val | 0) === val) {
        return Type.forSchema('int', opts);
      } else if (Math.abs(val) < 9007199254740991) {
        return Type.forSchema('float', opts);
      }
      return Type.forSchema('double', opts);
    case 'object':
      if (val === null) {
        return Type.forSchema('null', opts);
      } else if (Array.isArray(val)) {
        if (!val.length) {
          return opts.emptyArrayType;
        }
        return Type.forSchema({
          type: 'array',
          items: Type.forTypes(
            val.map(function (v) { return Type.forValue(v, opts); })
          )
        }, opts);
      } else if (Buffer.isBuffer(val)) {
        return Type.forSchema('bytes', opts);
      }
      var fieldNames = Object.keys(val);
      if (fieldNames.some(function (s) { return !isValidName(s); })) {
        // We have to fall back to a map.
        return Type.forSchema({
          type: 'map',
          values: Type.forTypes(fieldNames.map(function (s) {
            return Type.forValue(val[s], opts);
          }), opts)
        }, opts);
      }
      return Type.forSchema({
        type: 'record',
        fields: fieldNames.map(function (s) {
          return {name: s, type: Type.forValue(val[s], opts)};
        })
      }, opts);
    default:
      throw new Error(f('cannot infer type from: %j', val));
  }
};

Type.forTypes = function (types, opts) {
  if (!types.length) {
    throw new Error('no types to combine');
  }
  if (types.length === 1) {
    return types[0]; // Nothing to do.
  }
  opts = opts || {};

  // Extract any union types, with special care for wrapped unions (see below).
  var expanded = [];
  var numWrappedUnions = 0;
  var isValidWrappedUnion = true;
  types.forEach(function (type) {
    switch (type.typeName) {
      case 'union:unwrapped':
        isValidWrappedUnion = false;
        expanded = expanded.concat(type.types);
        break;
      case 'union:wrapped':
        numWrappedUnions++;
        expanded = expanded.concat(type.types);
        break;
      case 'null':
        expanded.push(type);
        break;
      default:
        isValidWrappedUnion = false;
        expanded.push(type);
    }
  });
  if (numWrappedUnions) {
    if (!isValidWrappedUnion) {
      // It is only valid to combine wrapped unions when no other type is
      // present other than wrapped unions and nulls (otherwise the values of
      // others wouldn't be valid in the resulting union).
      throw new Error('cannot combine wrapped union');
    }
    var branchTypes = {};
    expanded.forEach(function (type) {
      var name = type.branchName;
      var branchType = branchTypes[name];
      if (!branchType) {
        branchTypes[name] = type;
      } else if (!type.equals(branchType)) {
        throw new Error('inconsistent branch type');
      }
    });
    var wrapUnions = opts.wrapUnions;
    var unionType;
    opts.wrapUnions = true;
    try {
      unionType = Type.forSchema(Object.keys(branchTypes).map(function (name) {
        return branchTypes[name];
      }), opts);
    } catch (err) {
      opts.wrapUnions = wrapUnions;
      throw err;
    }
    opts.wrapUnions = wrapUnions;
    return unionType;
  }

  // Group types by category, similar to the logic for unwrapped unions.
  var bucketized = {};
  expanded.forEach(function (type) {
    var bucket = getTypeBucket(type);
    var bucketTypes = bucketized[bucket];
    if (!bucketTypes) {
      bucketized[bucket] = bucketTypes = [];
    }
    bucketTypes.push(type);
  });

  // Generate the "augmented" type for each group.
  var buckets = Object.keys(bucketized);
  var augmented = buckets.map(function (bucket) {
    var bucketTypes = bucketized[bucket];
    if (bucketTypes.length === 1) {
      return bucketTypes[0];
    } else {
      switch (bucket) {
        case 'null':
        case 'boolean':
          return bucketTypes[0];
        case 'number':
          return combineNumbers(bucketTypes);
        case 'string':
          return combineStrings(bucketTypes, opts);
        case 'buffer':
          return combineBuffers(bucketTypes, opts);
        case 'array':
          // Remove any sentinel arrays (used when inferring from empty arrays)
          // to avoid making things nullable when they shouldn't be.
          bucketTypes = bucketTypes.filter(function (t) {
            return t !== opts.emptyArrayType;
          });
          if (!bucketTypes.length) {
            // We still don't have a real type, just return the sentinel.
            return opts.emptyArrayType;
          }
          return Type.forSchema({
            type: 'array',
            items: Type.forTypes(bucketTypes.map(function (t) {
              return t.itemsType;
            }))
          }, opts);
        default:
          return combineObjects(bucketTypes, opts);
      }
    }
  });

  if (augmented.length === 1) {
    return augmented[0];
  } else {
    // We return an (unwrapped) union of all augmented types.
    return Type.forSchema(augmented, opts);
  }
};

Type.isType = function (/* any, [prefix] ... */) {
  var l = arguments.length;
  if (!l) {
    return false;
  }

  var any = arguments[0];
  if (
    !any ||
    typeof any._update != 'function' ||
    typeof any.fingerprint != 'function'
  ) {
    // Not fool-proof, but most likely good enough.
    return false;
  }

  if (l === 1) {
    // No type names specified, we are done.
    return true;
  }

  // We check if at least one of the prefixes matches.
  var typeName = any.typeName;
  var i;
  for (i = 1; i < l; i++) {
    if (typeName.indexOf(arguments[i]) === 0) {
      return true;
    }
  }
  return false;
};

Type.__reset = function (size) {
  debug('resetting type buffer to %d', size);
  TAP.buf = new buffer.SlowBuffer(size);
};

Object.defineProperty(Type.prototype, 'branchName', {
  enumerable: true,
  get: function () {
    if (this.name) {
      return this.name;
    }
    var type = Type.isType(this, 'logical') ? this.underlyingType : this;
    return Type.isType(type, 'union') ? undefined : type.typeName;
  }
});

Type.prototype.clone = function (val, opts) {
  if (opts) {
    opts = {
      coerce: !!opts.coerceBuffers | 0, // Coerce JSON to Buffer.
      fieldHook: opts.fieldHook,
      qualifyNames: !!opts.qualifyNames,
      skip: !!opts.skipMissingFields,
      wrap: !!opts.wrapUnions | 0 // Wrap first match into union.
    };
    return this._copy(val, opts);
  } else {
    // If no modifications are required, we can get by with a serialization
    // roundtrip (generally much faster than a standard deep copy).
    return this.fromBuffer(this.toBuffer(val));
  }
};

Type.prototype.compare = utils.abstractFunction;

Type.prototype.compareBuffers = function (buf1, buf2) {
  return this._match(new Tap(buf1), new Tap(buf2));
};

Type.prototype.createResolver = function (type, opts) {
  if (!Type.isType(type)) {
    // More explicit error message than the "incompatible type" thrown
    // otherwise (especially because of the overridden `toJSON` method).
    throw new Error(f('not a type: %j', type));
  }

  if (!Type.isType(this, 'union', 'logical') && Type.isType(type, 'logical')) {
    // Trying to read a logical type as a built-in: unwrap the logical type.
    // Note that we exclude unions to support resolving into unions containing
    // logical types.
    return this.createResolver(type.underlyingType, opts);
  }

  opts = opts || {};
  opts.registry = opts.registry || {};

  var resolver, key;
  if (
    Type.isType(this, 'record', 'error') &&
    Type.isType(type, 'record', 'error')
  ) {
    // We allow conversions between records and errors.
    key = this.name + ':' + type.name; // ':' is illegal in Avro type names.
    resolver = opts.registry[key];
    if (resolver) {
      return resolver;
    }
  }

  resolver = new Resolver(this);
  if (key) { // Register resolver early for recursive schemas.
    opts.registry[key] = resolver;
  }

  if (Type.isType(type, 'union')) {
    var resolvers = type.types.map(function (t) {
      return this.createResolver(t, opts);
    }, this);
    resolver._read = function (tap) {
      var index = tap.readLong();
      var resolver = resolvers[index];
      if (resolver === undefined) {
        throw new Error(f('invalid union index: %s', index));
      }
      return resolvers[index]._read(tap);
    };
  } else {
    this._update(resolver, type, opts);
  }

  if (!resolver._read) {
    throw new Error(f('cannot read %s as %s', type, this));
  }
  return Object.freeze(resolver);
};

Type.prototype.decode = function (buf, pos, resolver) {
  var tap = new Tap(buf, pos);
  var val = readValue(this, tap, resolver);
  if (!tap.isValid()) {
    return {value: undefined, offset: -1};
  }
  return {value: val, offset: tap.pos};
};

Type.prototype.encode = function (val, buf, pos) {
  var tap = new Tap(buf, pos);
  this._write(tap, val);
  if (!tap.isValid()) {
    // Don't throw as there is no way to predict this. We also return the
    // number of missing bytes to ease resizing.
    return buf.length - tap.pos;
  }
  return tap.pos;
};

Type.prototype.equals = function (type) {
  return (
    Type.isType(type) &&
    this.fingerprint().equals(type.fingerprint())
  );
};

Type.prototype.fingerprint = function (algorithm) {
  if (!algorithm) {
    if (!this._hash.str) {
      var schemaStr = JSON.stringify(this.schema());
      this._hash.str = utils.getHash(schemaStr).toString('binary');
    }
    return new Buffer(this._hash.str, 'binary');
  } else {
    return utils.getHash(JSON.stringify(this.schema()), algorithm);
  }
};

Type.prototype.fromBuffer = function (buf, resolver, noCheck) {
  var tap = new Tap(buf);
  var val = readValue(this, tap, resolver, noCheck);
  if (!tap.isValid()) {
    throw new Error('truncated buffer');
  }
  if (!noCheck && tap.pos < buf.length) {
    throw new Error('trailing data');
  }
  return val;
};

Type.prototype.fromString = function (str) {
  return this._copy(JSON.parse(str), {coerce: 2});
};

Type.prototype.inspect = function () {
  var typeName = this.typeName;
  var className = getClassName(typeName);
  if (isPrimitive(typeName)) {
    // The class name is sufficient to identify the type.
    return f('<%s>', className);
  } else {
    // We add a little metadata for convenience.
    var obj = this.schema({exportAttrs: true, noDeref: true});
    if (typeof obj == 'object' && !Type.isType(this, 'logical')) {
      obj.type = undefined; // Would be redundant with constructor name.
    }
    return f('<%s %j>', className, obj);
  }
};

Type.prototype.isValid = function (val, opts) {
  // We only have a single flag for now, so no need to complicate things.
  var flags = (opts && opts.noUndeclaredFields) | 0;
  var errorHook = opts && opts.errorHook;
  var hook, path;
  if (errorHook) {
    path = [];
    hook = function (any, type) {
      errorHook.call(this, path.slice(), any, type, val);
    };
  }
  return this._check(val, flags, hook, path);
};

Type.prototype.random = utils.abstractFunction;

Type.prototype.schema = function (opts) {
  // Copy the options to avoid mutating the original options object when we add
  // the registry of dereferenced types.
  return this._attrs({
    exportAttrs: !!(opts && opts.exportAttrs),
    noDeref: !!(opts && opts.noDeref)
  });
};

Type.prototype.toBuffer = function (val) {
  TAP.pos = 0;
  this._write(TAP, val);
  var buf = new Buffer(TAP.pos);
  if (TAP.isValid()) {
    TAP.buf.copy(buf, 0, 0, TAP.pos);
  } else {
    this._write(new Tap(buf), val);
  }
  return buf;
};

Type.prototype.toJSON = function () {
  // Convenience to allow using `JSON.stringify(type)` to get a type's schema.
  return this.schema({exportAttrs: true});
};

Type.prototype.toString = function (val) {
  if (val === undefined) {
    // Consistent behavior with standard `toString` expectations.
    return JSON.stringify(this.schema({noDeref: true}));
  }
  return JSON.stringify(this._copy(val, {coerce: 3}));
};

Type.prototype.wrap = function (val) {
  var Branch = this._branchConstructor;
  return Branch === null ? null : new Branch(val);
};

Type.prototype._attrs = function (opts) {
  // This function handles a lot of the common logic to schema generation
  // across types, for example keeping track of which types have already been
  // de-referenced (i.e. derefed).
  opts.derefed = opts.derefed || {};
  var name = this.name;
  if (name !== undefined) {
    if (opts.noDeref || opts.derefed[name]) {
      return name;
    }
    opts.derefed[name] = true;
  }
  var schema = {};
  // The order in which we add fields to the `schema` object matters here.
  // Since JS objects are unordered, this implementation (unfortunately) relies
  // on engines returning properties in the same order that they are inserted
  // in. This is not in the JS spec, but can be "somewhat" safely assumed (see
  // http://stackoverflow.com/q/5525795/1062617).
  if (this.name !== undefined) {
    schema.name = name;
  }
  schema.type = this.typeName;
  var derefedSchema = this._deref(schema, opts);
  if (derefedSchema !== undefined) {
    // We allow the original schema to be overridden (this will happen for
    // primitive types and logical types).
    schema = derefedSchema;
  }
  if (opts.exportAttrs) {
    if (this.aliases && this.aliases.length) {
      schema.aliases = this.aliases;
    }
    if (this.doc !== undefined) {
      schema.doc = this.doc;
    }
  }
  return schema;
};

Type.prototype._createBranchConstructor = function () {
  // jshint -W054
  var name = this.branchName;
  if (name === 'null') {
    return null;
  }
  var attr = ~name.indexOf('.') ? 'this[\'' + name + '\']' : 'this.' + name;
  var body = 'return function Branch$(val) { ' + attr + ' = val; };';
  var Branch = (new Function(body))();
  Branch.type = this;
  Branch.prototype.unwrap = new Function('return ' + attr + ';');
  Branch.prototype.unwrapped = Branch.prototype.unwrap; // Deprecated.
  return Branch;
};

Type.prototype._peek = function (tap) {
  var pos = tap.pos;
  var val = this._read(tap);
  tap.pos = pos;
  return val;
};

Type.prototype._check = utils.abstractFunction;
Type.prototype._copy = utils.abstractFunction;
Type.prototype._deref = utils.abstractFunction;
Type.prototype._match = utils.abstractFunction;
Type.prototype._read = utils.abstractFunction;
Type.prototype._skip = utils.abstractFunction;
Type.prototype._update = utils.abstractFunction;
Type.prototype._write = utils.abstractFunction;

// "Deprecated" getters (will be explicitly deprecated in 5.1).

Type.prototype.getAliases = function () { return this.aliases; };

Type.prototype.getFingerprint = Type.prototype.fingerprint;

Type.prototype.getName = function (asBranch) {
  return (this.name || !asBranch) ? this.name : this.branchName;
};

Type.prototype.getSchema = Type.prototype.schema;

Type.prototype.getTypeName = function () { return this.typeName; };

// Implementations.

/**
 * Base primitive Avro type.
 *
 * Most of the primitive types share the same cloning and resolution
 * mechanisms, provided by this class. This class also lets us conveniently
 * check whether a type is a primitive using `instanceof`.
 */
function PrimitiveType(noFreeze) {
  Type.call(this);
  this._branchConstructor = this._createBranchConstructor();
  if (!noFreeze) {
    // Abstract long types can't be frozen at this stage.
    Object.freeze(this);
  }
}
util.inherits(PrimitiveType, Type);

PrimitiveType.prototype._update = function (resolver, type) {
  if (type.typeName === this.typeName) {
    resolver._read = this._read;
  }
};

PrimitiveType.prototype._copy = function (val) {
  this._check(val, undefined, throwInvalidError);
  return val;
};

PrimitiveType.prototype._deref = function () { return this.typeName; };

PrimitiveType.prototype.compare = utils.compare;

/** Nulls. */
function NullType() { PrimitiveType.call(this); }
util.inherits(NullType, PrimitiveType);

NullType.prototype._check = function (val, flags, hook) {
  var b = val === null;
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

NullType.prototype._read = function () { return null; };

NullType.prototype._skip = function () {};

NullType.prototype._write = function (tap, val) {
  if (val !== null) {
    throwInvalidError(val, this);
  }
};

NullType.prototype._match = function () { return 0; };

NullType.prototype.compare = NullType.prototype._match;

NullType.prototype.typeName = 'null';

NullType.prototype.random = NullType.prototype._read;

/** Booleans. */
function BooleanType() { PrimitiveType.call(this); }
util.inherits(BooleanType, PrimitiveType);

BooleanType.prototype._check = function (val, flags, hook) {
  var b = typeof val == 'boolean';
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

BooleanType.prototype._read = function (tap) { return tap.readBoolean(); };

BooleanType.prototype._skip = function (tap) { tap.skipBoolean(); };

BooleanType.prototype._write = function (tap, val) {
  if (typeof val != 'boolean') {
    throwInvalidError(val, this);
  }
  tap.writeBoolean(val);
};

BooleanType.prototype._match = function (tap1, tap2) {
  return tap1.matchBoolean(tap2);
};

BooleanType.prototype.typeName = 'boolean';

BooleanType.prototype.random = function () { return RANDOM.nextBoolean(); };

/** Integers. */
function IntType() { PrimitiveType.call(this); }
util.inherits(IntType, PrimitiveType);

IntType.prototype._check = function (val, flags, hook) {
  var b = val === (val | 0);
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

IntType.prototype._read = function (tap) { return tap.readInt(); };

IntType.prototype._skip = function (tap) { tap.skipInt(); };

IntType.prototype._write = function (tap, val) {
  if (val !== (val | 0)) {
    throwInvalidError(val, this);
  }
  tap.writeInt(val);
};

IntType.prototype._match = function (tap1, tap2) {
  return tap1.matchInt(tap2);
};

IntType.prototype.typeName = 'int';

IntType.prototype.random = function () { return RANDOM.nextInt(1000) | 0; };

/**
 * Longs.
 *
 * We can't capture all the range unfortunately since JavaScript represents all
 * numbers internally as `double`s, so the default implementation plays safe
 * and throws rather than potentially silently change the data. See `__with` or
 * `AbstractLongType` below for a way to implement a custom long type.
 */
function LongType() { PrimitiveType.call(this); }
util.inherits(LongType, PrimitiveType);

LongType.prototype._check = function (val, flags, hook) {
  var b = typeof val == 'number' && val % 1 === 0 && isSafeLong(val);
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

LongType.prototype._read = function (tap) {
  var n = tap.readLong();
  if (!isSafeLong(n)) {
    throw new Error('potential precision loss');
  }
  return n;
};

LongType.prototype._skip = function (tap) { tap.skipLong(); };

LongType.prototype._write = function (tap, val) {
  if (typeof val != 'number' || val % 1 || !isSafeLong(val)) {
    throwInvalidError(val, this);
  }
  tap.writeLong(val);
};

LongType.prototype._match = function (tap1, tap2) {
  return tap1.matchLong(tap2);
};

LongType.prototype._update = function (resolver, type) {
  switch (type.typeName) {
    case 'int':
      resolver._read = type._read;
      break;
    case 'long':
      resolver._read = this._read; // In case `type` is an `AbstractLongType`.
  }
};

LongType.prototype.typeName = 'long';

LongType.prototype.random = function () { return RANDOM.nextInt(); };

LongType.__with = function (methods, noUnpack) {
  methods = methods || {}; // Will give a more helpful error message.
  // We map some of the methods to a different name to be able to intercept
  // their input and output (otherwise we wouldn't be able to perform any
  // unpacking logic, and the type wouldn't work when nested).
  var mapping = {
    toBuffer: '_toBuffer',
    fromBuffer: '_fromBuffer',
    fromJSON: '_fromJSON',
    toJSON: '_toJSON',
    isValid: '_isValid',
    compare: 'compare'
  };
  var type = new AbstractLongType(noUnpack);
  Object.keys(mapping).forEach(function (name) {
    if (methods[name] === undefined) {
      throw new Error(f('missing method implementation: %s', name));
    }
    type[mapping[name]] = methods[name];
  });
  return Object.freeze(type);
};

/** Floats. */
function FloatType() { PrimitiveType.call(this); }
util.inherits(FloatType, PrimitiveType);

FloatType.prototype._check = function (val, flags, hook) {
  var b = typeof val == 'number';
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

FloatType.prototype._read = function (tap) { return tap.readFloat(); };

FloatType.prototype._skip = function (tap) { tap.skipFloat(); };

FloatType.prototype._write = function (tap, val) {
  if (typeof val != 'number') {
    throwInvalidError(val, this);
  }
  tap.writeFloat(val);
};

FloatType.prototype._match = function (tap1, tap2) {
  return tap1.matchFloat(tap2);
};

FloatType.prototype._update = function (resolver, type) {
  switch (type.typeName) {
    case 'float':
    case 'int':
      resolver._read = type._read;
      break;
    case 'long':
      // No need to worry about precision loss here since we're always rounding
      // to float anyway.
      resolver._read = function (tap) { return tap.readLong(); };
  }
};

FloatType.prototype.typeName = 'float';

FloatType.prototype.random = function () { return RANDOM.nextFloat(1e3); };

/** Doubles. */
function DoubleType() { PrimitiveType.call(this); }
util.inherits(DoubleType, PrimitiveType);

DoubleType.prototype._check = function (val, flags, hook) {
  var b = typeof val == 'number';
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

DoubleType.prototype._read = function (tap) { return tap.readDouble(); };

DoubleType.prototype._skip = function (tap) { tap.skipDouble(); };

DoubleType.prototype._write = function (tap, val) {
  if (typeof val != 'number') {
    throwInvalidError(val, this);
  }
  tap.writeDouble(val);
};

DoubleType.prototype._match = function (tap1, tap2) {
  return tap1.matchDouble(tap2);
};

DoubleType.prototype._update = function (resolver, type) {
  switch (type.typeName) {
    case 'double':
    case 'float':
    case 'int':
      resolver._read = type._read;
      break;
    case 'long':
      // Similar to inside `FloatType`, no need to worry about precision loss
      // here since we're always rounding to double anyway.
      resolver._read = function (tap) { return tap.readLong(); };
  }
};

DoubleType.prototype.typeName = 'double';

DoubleType.prototype.random = function () { return RANDOM.nextFloat(); };

/** Strings. */
function StringType() { PrimitiveType.call(this); }
util.inherits(StringType, PrimitiveType);

StringType.prototype._check = function (val, flags, hook) {
  var b = typeof val == 'string';
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

StringType.prototype._read = function (tap) { return tap.readString(); };

StringType.prototype._skip = function (tap) { tap.skipString(); };

StringType.prototype._write = function (tap, val) {
  if (typeof val != 'string') {
    throwInvalidError(val, this);
  }
  tap.writeString(val);
};

StringType.prototype._match = function (tap1, tap2) {
  return tap1.matchString(tap2);
};

StringType.prototype._update = function (resolver, type) {
  switch (type.typeName) {
    case 'bytes':
    case 'string':
      resolver._read = this._read;
  }
};

StringType.prototype.typeName = 'string';

StringType.prototype.random = function () {
  return RANDOM.nextString(RANDOM.nextInt(32));
};

/**
 * Bytes.
 *
 * These are represented in memory as `Buffer`s rather than binary-encoded
 * strings. This is more efficient (when decoding/encoding from bytes, the
 * common use-case), idiomatic, and convenient.
 *
 * Note the coercion in `_copy`.
 */
function BytesType() { PrimitiveType.call(this); }
util.inherits(BytesType, PrimitiveType);

BytesType.prototype._check = function (val, flags, hook) {
  var b = Buffer.isBuffer(val);
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

BytesType.prototype._read = function (tap) { return tap.readBytes(); };

BytesType.prototype._skip = function (tap) { tap.skipBytes(); };

BytesType.prototype._write = function (tap, val) {
  if (!Buffer.isBuffer(val)) {
    throwInvalidError(val, this);
  }
  tap.writeBytes(val);
};

BytesType.prototype._match = function (tap1, tap2) {
  return tap1.matchBytes(tap2);
};

BytesType.prototype._update = StringType.prototype._update;

BytesType.prototype._copy = function (obj, opts) {
  var buf;
  switch ((opts && opts.coerce) | 0) {
    case 3: // Coerce buffers to strings.
      this._check(obj, undefined, throwInvalidError);
      return obj.toString('binary');
    case 2: // Coerce strings to buffers.
      if (typeof obj != 'string') {
        throw new Error(f('cannot coerce to buffer: %j', obj));
      }
      buf = new Buffer(obj, 'binary');
      this._check(buf, undefined, throwInvalidError);
      return buf;
    case 1: // Coerce buffer JSON representation to buffers.
      if (!isJsonBuffer(obj)) {
        throw new Error(f('cannot coerce to buffer: %j', obj));
      }
      buf = new Buffer(obj.data);
      this._check(buf, undefined, throwInvalidError);
      return buf;
    default: // Copy buffer.
      this._check(obj, undefined, throwInvalidError);
      return new Buffer(obj);
  }
};

BytesType.prototype.compare = Buffer.compare;

BytesType.prototype.typeName = 'bytes';

BytesType.prototype.random = function () {
  return RANDOM.nextBuffer(RANDOM.nextInt(32));
};

/** Base "abstract" Avro union type. */
function UnionType(schema, opts) {
  Type.call(this);

  if (!Array.isArray(schema)) {
    throw new Error(f('non-array union schema: %j', schema));
  }
  if (!schema.length) {
    throw new Error('empty union');
  }
  this.types = Object.freeze(schema.map(function (obj) {
    return Type.forSchema(obj, opts);
  }));

  this._branchIndices = {};
  this.types.forEach(function (type, i) {
    if (Type.isType(type, 'union')) {
      throw new Error('unions cannot be directly nested');
    }
    var branch = type.branchName;
    if (this._branchIndices[branch] !== undefined) {
      throw new Error(f('duplicate union branch name: %j', branch));
    }
    this._branchIndices[branch] = i;
  }, this);
}
util.inherits(UnionType, Type);

UnionType.prototype._branchConstructor = function () {
  throw new Error('unions cannot be directly wrapped');
};

UnionType.prototype._skip = function (tap) {
  this.types[tap.readLong()]._skip(tap);
};

UnionType.prototype._match = function (tap1, tap2) {
  var n1 = tap1.readLong();
  var n2 = tap2.readLong();
  if (n1 === n2) {
    return this.types[n1]._match(tap1, tap2);
  } else {
    return n1 < n2 ? -1 : 1;
  }
};

UnionType.prototype._deref = function (schema, opts) {
  return this.types.map(function (t) { return t._attrs(opts); });
};

UnionType.prototype.getTypes = function () { return this.types; };

/**
 * "Natural" union type.
 *
 * This representation doesn't require a wrapping object and is therefore
 * simpler and generally closer to what users expect. However it cannot be used
 * to represent all Avro unions since some lead to ambiguities (e.g. if two
 * number types are in the union).
 *
 * Currently, this union supports at most one type in each of the categories
 * below:
 *
 * + `null`
 * + `boolean`
 * + `int`, `long`, `float`, `double`
 * + `string`, `enum`
 * + `bytes`, `fixed`
 * + `array`
 * + `map`, `record`
 */
function UnwrappedUnionType(schema, opts) {
  UnionType.call(this, schema, opts);

  this._logicalBranches = null;
  this._bucketIndices = {};
  this.types.forEach(function (type, index) {
    if (Type.isType(type, 'logical')) {
      if (!this._logicalBranches) {
        this._logicalBranches = [];
      }
      this._logicalBranches.push({index: index, type: type});
    } else {
      var bucket = getTypeBucket(type);
      if (this._bucketIndices[bucket] !== undefined) {
        throw new Error(f('ambiguous unwrapped union: %j', this));
      }
      this._bucketIndices[bucket] = index;
    }
  }, this);

  Object.freeze(this);
}
util.inherits(UnwrappedUnionType, UnionType);

UnwrappedUnionType.prototype._getIndex = function (val) {
  var index = this._bucketIndices[getValueBucket(val)];
  if (this._logicalBranches) {
    // Slower path, we must run the value through all logical types.
    index = this._getLogicalIndex(val, index);
  }
  return index;
};

UnwrappedUnionType.prototype._getLogicalIndex = function (any, index) {
  var logicalBranches = this._logicalBranches;
  var i, l, branch;
  for (i = 0, l = logicalBranches.length; i < l; i++) {
    branch = logicalBranches[i];
    if (branch.type._check(any)) {
      if (index === undefined) {
        index = branch.index;
      } else {
        // More than one branch matches the value so we aren't guaranteed to
        // infer the correct type. We throw rather than corrupt data. This can
        // be fixed by "tightening" the logical types.
        throw new Error('ambiguous conversion');
      }
    }
  }
  return index;
};

UnwrappedUnionType.prototype._check = function (val, flags, hook, path) {
  var index = this._getIndex(val);
  var b = index !== undefined;
  if (b) {
    return this.types[index]._check(val, flags, hook, path);
  }
  if (hook) {
    hook(val, this);
  }
  return b;
};

UnwrappedUnionType.prototype._read = function (tap) {
  var index = tap.readLong();
  var branchType = this.types[index];
  if (branchType) {
    return branchType._read(tap);
  } else {
    throw new Error(f('invalid union index: %s', index));
  }
};

UnwrappedUnionType.prototype._write = function (tap, val) {
  var index = this._getIndex(val);
  if (index === undefined) {
    throwInvalidError(val, this);
  }
  tap.writeLong(index);
  if (val !== null) {
    this.types[index]._write(tap, val);
  }
};

UnwrappedUnionType.prototype._update = function (resolver, type, opts) {
  // jshint -W083
  // (The loop exits after the first function is created.)
  var i, l, typeResolver;
  for (i = 0, l = this.types.length; i < l; i++) {
    try {
      typeResolver = this.types[i].createResolver(type, opts);
    } catch (err) {
      continue;
    }
    resolver._read = function (tap) { return typeResolver._read(tap); };
    return;
  }
};

UnwrappedUnionType.prototype._copy = function (val, opts) {
  var coerce = opts && opts.coerce | 0;
  var wrap = opts && opts.wrap | 0;
  var index;
  if (wrap === 2) {
    // We are parsing a default, so always use the first branch's type.
    index = 0;
  } else {
    switch (coerce) {
      case 1:
        // Using the `coerceBuffers` option can cause corruption and erroneous
        // failures with unwrapped unions (in rare cases when the union also
        // contains a record which matches a buffer's JSON representation).
        if (isJsonBuffer(val) && this._bucketIndices.buffer !== undefined) {
          index = this._bucketIndices.buffer;
        } else {
          index = this._getIndex(val);
        }
        break;
      case 2:
        // Decoding from JSON, we must unwrap the value.
        if (val === null) {
          index = this._bucketIndices['null'];
        } else if (typeof val === 'object') {
          var keys = Object.keys(val);
          if (keys.length === 1) {
            index = this._branchIndices[keys[0]];
            val = val[keys[0]];
          }
        }
        break;
      default:
        index = this._getIndex(val);
    }
    if (index === undefined) {
      throwInvalidError(val, this);
    }
  }
  var type = this.types[index];
  if (val === null || wrap === 3) {
    return type._copy(val, opts);
  } else {
    switch (coerce) {
      case 3:
        // Encoding to JSON, we wrap the value.
        var obj = {};
        obj[type.branchName] = type._copy(val, opts);
        return obj;
      default:
        return type._copy(val, opts);
    }
  }
};

UnwrappedUnionType.prototype.compare = function (val1, val2) {
  var index1 = this._getIndex(val1);
  var index2 = this._getIndex(val2);
  if (index1 === undefined) {
    throwInvalidError(val1, this);
  } else if (index2 === undefined) {
    throwInvalidError(val2, this);
  } else if (index1 === index2) {
    return this.types[index1].compare(val1, val2);
  } else {
    return utils.compare(index1, index2);
  }
};

UnwrappedUnionType.prototype.typeName = 'union:unwrapped';

UnwrappedUnionType.prototype.random = function () {
  var index = RANDOM.nextInt(this.types.length);
  return this.types[index].random();
};

/**
 * Compatible union type.
 *
 * Values of this type are represented in memory similarly to their JSON
 * representation (i.e. inside an object with single key the name of the
 * contained type).
 *
 * This is not ideal, but is the most efficient way to unambiguously support
 * all unions. Here are a few reasons why the wrapping object is necessary:
 *
 * + Unions with multiple number types would have undefined behavior, unless
 *   numbers are wrapped (either everywhere, leading to large performance and
 *   convenience costs; or only when necessary inside unions, making it hard to
 *   understand when numbers are wrapped or not).
 * + Fixed types would have to be wrapped to be distinguished from bytes.
 * + Using record's constructor names would work (after a slight change to use
 *   the fully qualified name), but would mean that generic objects could no
 *   longer be valid records (making it inconvenient to do simple things like
 *   creating new records).
 */
function WrappedUnionType(schema, opts) {
  UnionType.call(this, schema, opts);
  Object.freeze(this);
}
util.inherits(WrappedUnionType, UnionType);

WrappedUnionType.prototype._check = function (val, flags, hook, path) {
  var b = false;
  if (val === null) {
    // Shortcut type lookup in this case.
    b = this._branchIndices['null'] !== undefined;
  } else if (typeof val == 'object') {
    var keys = Object.keys(val);
    if (keys.length === 1) {
      // We require a single key here to ensure that writes are correct and
      // efficient as soon as a record passes this check.
      var name = keys[0];
      var index = this._branchIndices[name];
      if (index !== undefined) {
        if (hook) {
          // Slow path.
          path.push(name);
          b = this.types[index]._check(val[name], flags, hook, path);
          path.pop();
          return b;
        } else {
          return this.types[index]._check(val[name], flags);
        }
      }
    }
  }
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

WrappedUnionType.prototype._read = function (tap) {
  var type = this.types[tap.readLong()];
  if (!type) {
    throw new Error(f('invalid union index'));
  }
  var Branch = type._branchConstructor;
  if (Branch === null) {
    return null;
  } else {
    return new Branch(type._read(tap));
  }
};

WrappedUnionType.prototype._write = function (tap, val) {
  var index, keys, name;
  if (val === null) {
    index = this._branchIndices['null'];
    if (index === undefined) {
      throwInvalidError(val, this);
    }
    tap.writeLong(index);
  } else {
    keys = Object.keys(val);
    if (keys.length === 1) {
      name = keys[0];
      index = this._branchIndices[name];
    }
    if (index === undefined) {
      throwInvalidError(val, this);
    }
    tap.writeLong(index);
    this.types[index]._write(tap, val[name]);
  }
};

WrappedUnionType.prototype._update = function (resolver, type, opts) {
  // jshint -W083
  // (The loop exits after the first function is created.)
  var i, l, typeResolver, Branch;
  for (i = 0, l = this.types.length; i < l; i++) {
    try {
      typeResolver = this.types[i].createResolver(type, opts);
    } catch (err) {
      continue;
    }
    Branch = this.types[i]._branchConstructor;
    if (Branch) {
      resolver._read = function (tap) {
        return new Branch(typeResolver._read(tap));
      };
    } else {
      resolver._read = function () { return null; };
    }
    return;
  }
};

WrappedUnionType.prototype._copy = function (val, opts) {
  var wrap = opts && opts.wrap | 0;
  if (wrap === 2) {
    var firstType = this.types[0];
    // Promote into first type (used for schema defaults).
    if (val === null && firstType.typeName === 'null') {
      return null;
    }
    return new firstType._branchConstructor(firstType._copy(val, opts));
  }
  if (val === null && this._branchIndices['null'] !== undefined) {
    return null;
  }

  var i, l, obj;
  if (typeof val == 'object') {
    var keys = Object.keys(val);
    if (keys.length === 1) {
      var name = keys[0];
      i = this._branchIndices[name];
      if (i === undefined && opts.qualifyNames) {
        // We are a bit more flexible than in `_check` here since we have
        // to deal with other serializers being less strict, so we fall
        // back to looking up unqualified names.
        var j, type;
        for (j = 0, l = this.types.length; j < l; j++) {
          type = this.types[j];
          if (type.name && name === unqualify(type.name)) {
            i = j;
            break;
          }
        }
      }
      if (i !== undefined) {
        obj = this.types[i]._copy(val[name], opts);
      }
    }
  }
  if (wrap === 1 && obj === undefined) {
    // Try promoting into first match (convenience, slow).
    i = 0;
    l = this.types.length;
    while (i < l && obj === undefined) {
      try {
        obj = this.types[i]._copy(val, opts);
      } catch (err) {
        i++;
      }
    }
  }
  if (obj !== undefined) {
    return wrap === 3 ? obj : new this.types[i]._branchConstructor(obj);
  }
  throwInvalidError(val, this);
};

WrappedUnionType.prototype.compare = function (val1, val2) {
  var name1 = val1 === null ? 'null' : Object.keys(val1)[0];
  var name2 = val2 === null ? 'null' : Object.keys(val2)[0];
  var index = this._branchIndices[name1];
  if (name1 === name2) {
    return name1 === 'null' ?
      0 :
      this.types[index].compare(val1[name1], val2[name1]);
  } else {
    return utils.compare(index, this._branchIndices[name2]);
  }
};

WrappedUnionType.prototype.typeName = 'union:wrapped';

WrappedUnionType.prototype.random = function () {
  var index = RANDOM.nextInt(this.types.length);
  var type = this.types[index];
  var Branch = type._branchConstructor;
  if (!Branch) {
    return null;
  }
  return new Branch(type.random());
};

/**
 * Avro enum type.
 *
 * Represented as strings (with allowed values from the set of symbols). Using
 * integers would be a reasonable option, but the performance boost is arguably
 * offset by the legibility cost and the extra deviation from the JSON encoding
 * convention.
 *
 * An integer representation can still be used (e.g. for compatibility with
 * TypeScript `enum`s) by overriding the `EnumType` with a `LongType` (e.g. via
 * `parse`'s registry).
 */
function EnumType(schema, opts) {
  Type.call(this, schema, opts);
  if (!Array.isArray(schema.symbols) || !schema.symbols.length) {
    throw new Error(f('invalid enum symbols: %j', schema.symbols));
  }
  this.symbols = Object.freeze(schema.symbols.slice());
  this._indices = {};
  this.symbols.forEach(function (symbol, i) {
    if (!isValidName(symbol)) {
      throw new Error(f('invalid %s symbol: %j', this, symbol));
    }
    if (this._indices[symbol] !== undefined) {
      throw new Error(f('duplicate %s symbol: %j', this, symbol));
    }
    this._indices[symbol] = i;
  }, this);
  this._branchConstructor = this._createBranchConstructor();
  Object.freeze(this);
}
util.inherits(EnumType, Type);

EnumType.prototype._check = function (val, flags, hook) {
  var b = this._indices[val] !== undefined;
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

EnumType.prototype._read = function (tap) {
  var index = tap.readLong();
  var symbol = this.symbols[index];
  if (symbol === undefined) {
    throw new Error(f('invalid %s enum index: %s', this.name, index));
  }
  return symbol;
};

EnumType.prototype._skip = function (tap) { tap.skipLong(); };

EnumType.prototype._write = function (tap, val) {
  var index = this._indices[val];
  if (index === undefined) {
    throwInvalidError(val, this);
  }
  tap.writeLong(index);
};

EnumType.prototype._match = function (tap1, tap2) {
  return tap1.matchLong(tap2);
};

EnumType.prototype.compare = function (val1, val2) {
  return utils.compare(this._indices[val1], this._indices[val2]);
};

EnumType.prototype._update = function (resolver, type) {
  var symbols = this.symbols;
  if (
    type.typeName === 'enum' &&
    (!type.name || ~getAliases(this).indexOf(type.name)) &&
    type.symbols.every(function (s) { return ~symbols.indexOf(s); })
  ) {
    resolver.symbols = type.symbols;
    resolver._read = type._read;
  }
};

EnumType.prototype._copy = function (val) {
  this._check(val, undefined, throwInvalidError);
  return val;
};

EnumType.prototype._deref = function (schema) {
  schema.symbols = this.symbols;
};

EnumType.prototype.getSymbols = function () { return this.symbols; };

EnumType.prototype.typeName = 'enum';

EnumType.prototype.random = function () {
  return RANDOM.choice(this.symbols);
};

/** Avro fixed type. Represented simply as a `Buffer`. */
function FixedType(schema, opts) {
  Type.call(this, schema, opts);
  if (schema.size !== (schema.size | 0) || schema.size < 1) {
    throw new Error(f('invalid %s size', this.branchName));
  }
  this.size = schema.size | 0;
  this._branchConstructor = this._createBranchConstructor();
  Object.freeze(this);
}
util.inherits(FixedType, Type);

FixedType.prototype._check = function (val, flags, hook) {
  var b = Buffer.isBuffer(val) && val.length === this.size;
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

FixedType.prototype._read = function (tap) {
  return tap.readFixed(this.size);
};

FixedType.prototype._skip = function (tap) {
  tap.skipFixed(this.size);
};

FixedType.prototype._write = function (tap, val) {
  if (!Buffer.isBuffer(val) || val.length !== this.size) {
    throwInvalidError(val, this);
  }
  tap.writeFixed(val, this.size);
};

FixedType.prototype._match = function (tap1, tap2) {
  return tap1.matchFixed(tap2, this.size);
};

FixedType.prototype.compare = Buffer.compare;

FixedType.prototype._update = function (resolver, type) {
  if (
    type.typeName === 'fixed' &&
    this.size === type.size &&
    (!type.name || ~getAliases(this).indexOf(type.name))
  ) {
    resolver.size = this.size;
    resolver._read = this._read;
  }
};

FixedType.prototype._copy = BytesType.prototype._copy;

FixedType.prototype._deref = function (schema) { schema.size = this.size; };

FixedType.prototype.getSize = function () { return this.size; };

FixedType.prototype.typeName = 'fixed';

FixedType.prototype.random = function () {
  return RANDOM.nextBuffer(this.size);
};

/** Avro map. Represented as vanilla objects. */
function MapType(schema, opts) {
  Type.call(this);
  if (!schema.values) {
    throw new Error(f('missing map values: %j', schema));
  }
  this.valuesType = Type.forSchema(schema.values, opts);
  this._branchConstructor = this._createBranchConstructor();
  Object.freeze(this);
}
util.inherits(MapType, Type);

MapType.prototype._check = function (val, flags, hook, path) {
  if (!val || typeof val != 'object' || Array.isArray(val)) {
    if (hook) {
      hook(val, this);
    }
    return false;
  }

  var keys = Object.keys(val);
  var b = true;
  var i, l, j, key;
  if (hook) {
    // Slow path.
    j = path.length;
    path.push('');
    for (i = 0, l = keys.length; i < l; i++) {
      key = path[j] = keys[i];
      if (!this.valuesType._check(val[key], flags, hook, path)) {
        b = false;
      }
    }
    path.pop();
  } else {
    for (i = 0, l = keys.length; i < l; i++) {
      if (!this.valuesType._check(val[keys[i]], flags)) {
        return false;
      }
    }
  }
  return b;
};

MapType.prototype._read = function (tap) {
  var values = this.valuesType;
  var val = {};
  var n;
  while ((n = readArraySize(tap))) {
    while (n--) {
      var key = tap.readString();
      val[key] = values._read(tap);
    }
  }
  return val;
};

MapType.prototype._skip = function (tap) {
  var values = this.valuesType;
  var len, n;
  while ((n = tap.readLong())) {
    if (n < 0) {
      len = tap.readLong();
      tap.pos += len;
    } else {
      while (n--) {
        tap.skipString();
        values._skip(tap);
      }
    }
  }
};

MapType.prototype._write = function (tap, val) {
  if (!val || typeof val != 'object' || Array.isArray(val)) {
    throwInvalidError(val, this);
  }

  var values = this.valuesType;
  var keys = Object.keys(val);
  var n = keys.length;
  var i, key;
  if (n) {
    tap.writeLong(n);
    for (i = 0; i < n; i++) {
      key = keys[i];
      tap.writeString(key);
      values._write(tap, val[key]);
    }
  }
  tap.writeLong(0);
};

MapType.prototype._match = function () {
  throw new Error('maps cannot be compared');
};

MapType.prototype._update = function (rsv, type, opts) {
  if (type.typeName === 'map') {
    rsv.valuesType = this.valuesType.createResolver(type.valuesType, opts);
    rsv._read = this._read;
  }
};

MapType.prototype._copy = function (val, opts) {
  if (val && typeof val == 'object' && !Array.isArray(val)) {
    var values = this.valuesType;
    var keys = Object.keys(val);
    var i, l, key;
    var copy = {};
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      copy[key] = values._copy(val[key], opts);
    }
    return copy;
  }
  throwInvalidError(val, this);
};

MapType.prototype.compare = MapType.prototype._match;

MapType.prototype.typeName = 'map';

MapType.prototype.getValuesType = function () { return this.valuesType; };

MapType.prototype.random = function () {
  var val = {};
  var i, l;
  for (i = 0, l = RANDOM.nextInt(10); i < l; i++) {
    val[RANDOM.nextString(RANDOM.nextInt(20))] = this.valuesType.random();
  }
  return val;
};

MapType.prototype._deref = function (schema, opts) {
  schema.values = this.valuesType._attrs(opts);
};

/** Avro array. Represented as vanilla arrays. */
function ArrayType(schema, opts) {
  Type.call(this);
  if (!schema.items) {
    throw new Error(f('missing array items: %j', schema));
  }
  this.itemsType = Type.forSchema(schema.items, opts);
  this._branchConstructor = this._createBranchConstructor();
  Object.freeze(this);
}
util.inherits(ArrayType, Type);

ArrayType.prototype._check = function (val, flags, hook, path) {
  if (!Array.isArray(val)) {
    if (hook) {
      hook(val, this);
    }
    return false;
  }

  var b = true;
  var i, l, j;
  if (hook) {
    // Slow path.
    j = path.length;
    path.push('');
    for (i = 0, l = val.length; i < l; i++) {
      path[j] = '' + i;
      if (!this.itemsType._check(val[i], flags, hook, path)) {
        b = false;
      }
    }
    path.pop();
  } else {
    for (i = 0, l = val.length; i < l; i++) {
      if (!this.itemsType._check(val[i], flags)) {
        return false;
      }
    }
  }
  return b;
};

ArrayType.prototype._read = function (tap) {
  var items = this.itemsType;
  var val = [];
  var n;
  while ((n = tap.readLong())) {
    if (n < 0) {
      n = -n;
      tap.skipLong(); // Skip size.
    }
    while (n--) {
      val.push(items._read(tap));
    }
  }
  return val;
};

ArrayType.prototype._skip = function (tap) {
  var len, n;
  while ((n = tap.readLong())) {
    if (n < 0) {
      len = tap.readLong();
      tap.pos += len;
    } else {
      while (n--) {
        this.itemsType._skip(tap);
      }
    }
  }
};

ArrayType.prototype._write = function (tap, val) {
  if (!Array.isArray(val)) {
    throwInvalidError(val, this);
  }

  var n = val.length;
  var i;
  if (n) {
    tap.writeLong(n);
    for (i = 0; i < n; i++) {
      this.itemsType._write(tap, val[i]);
    }
  }
  tap.writeLong(0);
};

ArrayType.prototype._match = function (tap1, tap2) {
  var n1 = tap1.readLong();
  var n2 = tap2.readLong();
  var f;
  while (n1 && n2) {
    f = this.itemsType._match(tap1, tap2);
    if (f) {
      return f;
    }
    if (!--n1) {
      n1 = readArraySize(tap1);
    }
    if (!--n2) {
      n2 = readArraySize(tap2);
    }
  }
  return utils.compare(n1, n2);
};

ArrayType.prototype._update = function (resolver, type, opts) {
  if (type.typeName === 'array') {
    resolver.itemsType = this.itemsType.createResolver(type.itemsType, opts);
    resolver._read = this._read;
  }
};

ArrayType.prototype._copy = function (val, opts) {
  if (!Array.isArray(val)) {
    throwInvalidError(val, this);
  }
  var items = new Array(val.length);
  var i, l;
  for (i = 0, l = val.length; i < l; i++) {
    items[i] = this.itemsType._copy(val[i], opts);
  }
  return items;
};

ArrayType.prototype._deref = function (schema, opts) {
  schema.items = this.itemsType._attrs(opts);
};

ArrayType.prototype.compare = function (val1, val2) {
  var n1 = val1.length;
  var n2 = val2.length;
  var i, l, f;
  for (i = 0, l = Math.min(n1, n2); i < l; i++) {
    if ((f = this.itemsType.compare(val1[i], val2[i]))) {
      return f;
    }
  }
  return utils.compare(n1, n2);
};

ArrayType.prototype.getItemsType = function () { return this.itemsType; };

ArrayType.prototype.typeName = 'array';

ArrayType.prototype.random = function () {
  var arr = [];
  var i, l;
  for (i = 0, l = RANDOM.nextInt(10); i < l; i++) {
    arr.push(this.itemsType.random());
  }
  return arr;
};

/**
 * Avro record.
 *
 * Values are represented as instances of a programmatically generated
 * constructor (similar to a "specific record"), available via the
 * `getRecordConstructor` method. This "specific record class" gives
 * significant speedups over using generics objects.
 *
 * Note that vanilla objects are still accepted as valid as long as their
 * fields match (this makes it much more convenient to do simple things like
 * update nested records).
 *
 * This type is also used for errors (similar, except for the extra `Error`
 * constructor call) and for messages (see comment below).
 */
function RecordType(schema, opts) {
  // Force creation of the options object in case we need to register this
  // record's name.
  opts = opts || {};

  // Save the namespace to restore it as we leave this record's scope.
  var namespace = opts.namespace;
  if (schema.namespace !== undefined) {
    opts.namespace = schema.namespace;
  } else if (schema.name) {
    // Fully qualified names' namespaces are used when no explicit namespace
    // attribute was specified.
    var match = /^(.*)\.[^.]+$/.exec(schema.name);
    if (match) {
      opts.namespace = match[1];
    }
  }
  Type.call(this, schema, opts);

  if (!Array.isArray(schema.fields)) {
    throw new Error(f('non-array record fields: %j', schema.fields));
  }
  if (utils.hasDuplicates(schema.fields, function (f) { return f.name; })) {
    throw new Error(f('duplicate field name: %j', schema.fields));
  }
  this._fieldsByName = {};
  this.fields = Object.freeze(schema.fields.map(function (f) {
    var field = new Field(f, opts);
    this._fieldsByName[field.name] = field;
    return field;
  }, this));
  this._branchConstructor = this._createBranchConstructor();
  this._isError = schema.type === 'error';
  this.recordConstructor = this._createConstructor(opts.errorStackTraces);
  this._read = this._createReader();
  this._skip = this._createSkipper();
  this._write = this._createWriter();
  this._check = this._createChecker();

  opts.namespace = namespace;
  Object.freeze(this);
}
util.inherits(RecordType, Type);

RecordType.prototype._getConstructorName = function () {
  return this.name ?
    unqualify(this.name) :
    this._isError ? 'Error$' : 'Record$';
};

RecordType.prototype._createConstructor = function (errorStackTraces) {
  // jshint -W054
  var outerArgs = [];
  var innerArgs = [];
  var ds = []; // Defaults.
  var innerBody = '';
  var i, l, field, name, defaultValue, hasDefault, stackField;
  for (i = 0, l = this.fields.length; i < l; i++) {
    field = this.fields[i];
    defaultValue = field.defaultValue;
    hasDefault = defaultValue() !== undefined;
    name = field.name;
    if (
      errorStackTraces && this._isError && name === 'stack' &&
      Type.isType(field.type, 'string') && !hasDefault
    ) {
      // We keep track of whether we've encountered a valid stack field (in
      // particular, without a default) to populate a stack trace below.
      stackField = field;
    }
    innerArgs.push('v' + i);
    innerBody += '  ';
    if (!hasDefault) {
      innerBody += 'this.' + name + ' = v' + i + ';\n';
    } else {
      innerBody += 'if (v' + i + ' === undefined) { ';
      innerBody += 'this.' + name + ' = d' + ds.length + '(); ';
      innerBody += '} else { this.' + name + ' = v' + i + '; }\n';
      outerArgs.push('d' + ds.length);
      ds.push(defaultValue);
    }
  }
  if (stackField) {
    // We should populate a stack trace.
    innerBody += '  if (this.stack === undefined) { ';
    /* istanbul ignore else */
    if (typeof Error.captureStackTrace == 'function') {
      // v8 runtimes, the easy case.
      innerBody += 'Error.captureStackTrace(this, this.constructor);';
    } else {
      // A few other runtimes (e.g. SpiderMonkey), might not work everywhere.
      innerBody += 'this.stack = Error().stack;';
    }
    innerBody += ' }\n';
  }
  var outerBody = 'return function ' + this._getConstructorName() + '(';
  outerBody += innerArgs.join() + ') {\n' + innerBody + '};';
  var Record = new Function(outerArgs.join(), outerBody).apply(undefined, ds);

  var self = this;
  Record.getType = function () { return self; };
  Record.type = self;
  if (this._isError) {
    util.inherits(Record, Error);
    Record.prototype.name = this._getConstructorName();
  }
  Record.prototype.clone = function (o) { return self.clone(this, o); };
  Record.prototype.compare = function (v) { return self.compare(this, v); };
  Record.prototype.isValid = function (o) { return self.isValid(this, o); };
  Record.prototype.toBuffer = function () { return self.toBuffer(this); };
  Record.prototype.toString = function () { return self.toString(this); };
  Record.prototype.wrap = function () { return self.wrap(this); };
  Record.prototype.wrapped = Record.prototype.wrap; // Deprecated.
  return Record;
};

RecordType.prototype._createChecker = function () {
  // jshint -W054
  var names = [];
  var values = [];
  var name = this._getConstructorName();
  var body = 'return function check' + name + '(v, f, h, p) {\n';
  body += '  if (\n';
  body += '    v === null ||\n';
  body += '    typeof v != \'object\' ||\n';
  body += '    (f && !this._checkFields(v))\n';
  body += '  ) {\n';
  body += '    if (h) { h(v, this); }\n';
  body += '    return false;\n';
  body += '  }\n';
  if (!this.fields.length) {
    // Special case, empty record. We handle this directly.
    body += '  return true;\n';
  } else {
    for (i = 0, l = this.fields.length; i < l; i++) {
      field = this.fields[i];
      names.push('t' + i);
      values.push(field.type);
      if (field.defaultValue() !== undefined) {
        body += '  var v' + i + ' = v.' + field.name + ';\n';
      }
    }
    body += '  if (h) {\n';
    body += '    var b = 1;\n';
    body += '    var j = p.length;\n';
    body += '    p.push(\'\');\n';
    var i, l, field;
    for (i = 0, l = this.fields.length; i < l; i++) {
      field = this.fields[i];
      body += '    p[j] = \'' + field.name + '\';\n';
      body += '    b &= ';
      if (field.defaultValue() === undefined) {
        body += 't' + i + '._check(v.' + field.name + ', f, h, p);\n';
      } else {
        body += 'v' + i + ' === undefined || ';
        body += 't' + i + '._check(v' + i + ', f, h, p);\n';
      }
    }
    body += '    p.pop();\n';
    body += '    return !!b;\n';
    body += '  } else {\n    return (\n      ';
    body += this.fields.map(function (field, i) {
      return field.defaultValue() === undefined ?
        't' + i + '._check(v.' + field.name + ', f)' :
        '(v' + i + ' === undefined || t' + i + '._check(v' + i + ', f))';
    }).join(' &&\n      ');
    body += '\n    );\n  }\n';
  }
  body += '};';
  return new Function(names.join(), body).apply(undefined, values);
};

RecordType.prototype._createReader = function () {
  // jshint -W054
  var names = [];
  var values = [this.recordConstructor];
  var i, l;
  for (i = 0, l = this.fields.length; i < l; i++) {
    names.push('t' + i);
    values.push(this.fields[i].type);
  }
  var name = this._getConstructorName();
  var body = 'return function read' + name + '(t) {\n';
  body += '  return new ' + name + '(\n    ';
  body += names.map(function (s) { return s + '._read(t)'; }).join(',\n    ');
  body += '\n  );\n};';
  names.unshift(name);
  // We can do this since the JS spec guarantees that function arguments are
  // evaluated from left to right.
  return new Function(names.join(), body).apply(undefined, values);
};

RecordType.prototype._createSkipper = function () {
  // jshint -W054
  var args = [];
  var body = 'return function skip' + this._getConstructorName() + '(t) {\n';
  var values = [];
  var i, l;
  for (i = 0, l = this.fields.length; i < l; i++) {
    args.push('t' + i);
    values.push(this.fields[i].type);
    body += '  t' + i + '._skip(t);\n';
  }
  body += '}';
  return new Function(args.join(), body).apply(undefined, values);
};

RecordType.prototype._createWriter = function () {
  // jshint -W054
  // We still do default handling here, in case a normal JS object is passed.
  var args = [];
  var name = this._getConstructorName();
  var body = 'return function write' + name + '(t, v) {\n';
  var values = [];
  var i, l, field, value;
  for (i = 0, l = this.fields.length; i < l; i++) {
    field = this.fields[i];
    args.push('t' + i);
    values.push(field.type);
    body += '  ';
    if (field.defaultValue() === undefined) {
      body += 't' + i + '._write(t, v.' + field.name + ');\n';
    } else {
      value = field.type.toBuffer(field.defaultValue()).toString('binary');
      // Convert the default value to a binary string ahead of time. We aren't
      // converting it to a buffer to avoid retaining too much memory. If we
      // had our own buffer pool, this could be an idea in the future.
      args.push('d' + i);
      values.push(value);
      body += 'var v' + i + ' = v.' + field.name + ';\n';
      body += 'if (v' + i + ' === undefined) {\n';
      body += '    t.writeBinary(d' + i + ', ' + value.length + ');\n';
      body += '  } else {\n    t' + i + '._write(t, v' + i + ');\n  }\n';
    }
  }
  body += '}';
  return new Function(args.join(), body).apply(undefined, values);
};

RecordType.prototype._update = function (resolver, type, opts) {
  // jshint -W054
  if (type.name && !~getAliases(this).indexOf(type.name)) {
    throw new Error(f('no alias found for %s', type.name));
  }

  var rFields = this.fields;
  var wFields = type.fields;
  var wFieldsMap = utils.toMap(wFields, function (f) { return f.name; });

  var innerArgs = []; // Arguments for reader constructor.
  var resolvers = {}; // Resolvers keyed by writer field name.
  var i, j, field, name, names, matches, fieldResolver;
  for (i = 0; i < rFields.length; i++) {
    field = rFields[i];
    names = getAliases(field);
    matches = [];
    for (j = 0; j < names.length; j++) {
      name = names[j];
      if (wFieldsMap[name]) {
        matches.push(name);
      }
    }
    if (matches.length > 1) {
      throw new Error(
        f('ambiguous aliasing for %s.%s (%s)', type.name, field.name, matches)
      );
    }
    if (!matches.length) {
      if (field.defaultValue() === undefined) {
        throw new Error(
          f('no matching field for default-less %s.%s', type.name, field.name)
        );
      }
      innerArgs.push('undefined');
    } else {
      name = matches[0];
      fieldResolver = {
        resolver: field.type.createResolver(wFieldsMap[name].type, opts),
        name: '_' + field.name, // Reader field name.
      };
      if (!resolvers[name]) {
        resolvers[name] = [fieldResolver];
      } else {
        resolvers[name].push(fieldResolver);
      }
      innerArgs.push(fieldResolver.name);
    }
  }

  // See if we can add a bypass for unused fields at the end of the record.
  var lazyIndex = -1;
  i = wFields.length;
  while (i && resolvers[wFields[--i].name] === undefined) {
    lazyIndex = i;
  }

  var uname = this._getConstructorName();
  var args = [uname];
  var values = [this.recordConstructor];
  var body = '  return function read' + uname + '(t, b) {\n';
  for (i = 0; i < wFields.length; i++) {
    if (i === lazyIndex) {
      body += '  if (!b) {\n';
    }
    field = type.fields[i];
    name = field.name;
    if (resolvers[name] === undefined) {
      body += (~lazyIndex && i >= lazyIndex) ? '    ' : '  ';
      args.push('r' + i);
      values.push(field.type);
      body += 'r' + i + '._skip(t);\n';
    } else {
      j = resolvers[name].length;
      while (j--) {
        body += (~lazyIndex && i >= lazyIndex) ? '    ' : '  ';
        args.push('r' + i + 'f' + j);
        fieldResolver = resolvers[name][j];
        values.push(fieldResolver.resolver);
        body += 'var ' + fieldResolver.name + ' = ';
        body += 'r' + i + 'f' + j + '._' + (j ? 'peek' : 'read') + '(t);\n';
      }
    }
  }
  if (~lazyIndex) {
    body += '  }\n';
  }
  body += '  return new ' + uname + '(' + innerArgs.join() + ');\n};';

  resolver._read = new Function(args.join(), body).apply(undefined, values);
};

RecordType.prototype._match = function (tap1, tap2) {
  var fields = this.fields;
  var i, l, field, order, type;
  for (i = 0, l = fields.length; i < l; i++) {
    field = fields[i];
    order = field._order;
    type = field.type;
    if (order) {
      order *= type._match(tap1, tap2);
      if (order) {
        return order;
      }
    } else {
      type._skip(tap1);
      type._skip(tap2);
    }
  }
  return 0;
};

RecordType.prototype._checkFields = function (obj) {
  var keys = Object.keys(obj);
  var i, l;
  for (i = 0, l = keys.length; i < l; i++) {
    if (!this._fieldsByName[keys[i]]) {
      return false;
    }
  }
  return true;
};

RecordType.prototype._copy = function (val, opts) {
  // jshint -W058
  var hook = opts && opts.fieldHook;
  var values = [undefined];
  var i, l, field, value;
  for (i = 0, l = this.fields.length; i < l; i++) {
    field = this.fields[i];
    value = val[field.name];
    if (value === undefined && field.hasOwnProperty('defaultValue')) {
      value = field.defaultValue();
    } else if ((opts && !opts.skip) || value !== undefined) {
      value = field.type._copy(value, opts);
    }
    if (hook) {
      value = hook(field, value, this);
    }
    values.push(value);
  }
  var Record = this.recordConstructor;
  return new (Record.bind.apply(Record, values))();
};

RecordType.prototype._deref = function (schema, opts) {
  schema.fields = this.fields.map(function (field) {
    var fieldType = field.type;
    var fieldSchema = {
      name: field.name,
      type: fieldType._attrs(opts)
    };
    if (opts.exportAttrs) {
      var val = field.defaultValue();
      if (val !== undefined) {
        // We must both unwrap all unions and coerce buffers to strings.
        fieldSchema['default'] = fieldType._copy(val, {coerce: 3, wrap: 3});
      }
      var fieldOrder = field.order;
      if (fieldOrder !== 'ascending') {
        fieldSchema.order = fieldOrder;
      }
      var fieldAliases = field.aliases;
      if (fieldAliases.length) {
        fieldSchema.aliases = fieldAliases;
      }
      var fieldDoc = field.doc;
      if (fieldDoc !== undefined) {
        fieldSchema.doc = fieldDoc;
      }
    }
    return fieldSchema;
  });
};

RecordType.prototype.compare = function (val1, val2) {
  var fields = this.fields;
  var i, l, field, name, order, type;
  for (i = 0, l = fields.length; i < l; i++) {
    field = fields[i];
    name = field.name;
    order = field._order;
    type = field.type;
    if (order) {
      order *= type.compare(val1[name], val2[name]);
      if (order) {
        return order;
      }
    }
  }
  return 0;
};

RecordType.prototype.random = function () {
  // jshint -W058
  var fields = this.fields.map(function (f) { return f.type.random(); });
  fields.unshift(undefined);
  var Record = this.recordConstructor;
  return new (Record.bind.apply(Record, fields))();
};

RecordType.prototype.field = function (name) {
  return this._fieldsByName[name];
};

RecordType.prototype.getField = RecordType.prototype.field;

RecordType.prototype.getFields = function () { return this.fields; };

RecordType.prototype.getRecordConstructor = function () {
  return this.recordConstructor;
};

Object.defineProperty(RecordType.prototype, 'typeName', {
  enumerable: true,
  get: function () { return this._isError ? 'error' : 'record'; }
});

/** Derived type abstract class. */
function LogicalType(schema, opts) {
  this._logicalTypeName = schema.logicalType;
  Type.call(this);
  LOGICAL_TYPE = this;
  try {
    this._underlyingType = Type.forSchema(schema, opts);
  } finally {
    LOGICAL_TYPE = null;
    // Remove the underlying type now that we're done instantiating. Note that
    // in some (rare) cases, it might not have been inserted; for example, if
    // this constructor was manually called with an already instantiated type.
    var l = UNDERLYING_TYPES.length;
    if (l && UNDERLYING_TYPES[l - 1][0] === this) {
      UNDERLYING_TYPES.pop();
    }
  }
  // We create a separate branch constructor for logical types to keep them
  // monomorphic.
  if (Type.isType(this.underlyingType, 'union')) {
    this._branchConstructor = this.underlyingType._branchConstructor;
  } else {
    this._branchConstructor = this.underlyingType._createBranchConstructor();
  }
  // We don't freeze derived types to allow arbitrary properties. Implementors
  // can still do so in the subclass' constructor at their convenience.
}
util.inherits(LogicalType, Type);

Object.defineProperty(LogicalType.prototype, 'typeName', {
  enumerable: true,
  get: function () { return 'logical:' + this._logicalTypeName; }
});

Object.defineProperty(LogicalType.prototype, 'underlyingType', {
  enumerable: true,
  get: function () {
    if (this._underlyingType) {
      return this._underlyingType;
    }
    // If the field wasn't present, it means the logical type isn't complete
    // yet: we're waiting on its underlying type to be fully instantiated. In
    // this case, it will be present in the `UNDERLYING_TYPES` array.
    var i, l, arr;
    for (i = 0, l = UNDERLYING_TYPES.length; i < l; i++) {
      arr = UNDERLYING_TYPES[i];
      if (arr[0] === this) {
        return arr[1];
      }
    }
  }
});

LogicalType.prototype.getUnderlyingType = function () {
  return this.underlyingType;
};

LogicalType.prototype._read = function (tap) {
  return this._fromValue(this.underlyingType._read(tap));
};

LogicalType.prototype._write = function (tap, any) {
  this.underlyingType._write(tap, this._toValue(any));
};

LogicalType.prototype._check = function (any, flags, hook, path) {
  try {
    var val = this._toValue(any);
  } catch (err) {
    // Handled below.
  }
  if (val === undefined) {
    if (hook) {
      hook(any, this);
    }
    return false;
  }
  return this.underlyingType._check(val, flags, hook, path);
};

LogicalType.prototype._copy = function (any, opts) {
  var type = this.underlyingType;
  switch (opts && opts.coerce) {
    case 3: // To string.
      return type._copy(this._toValue(any), opts);
    case 2: // From string.
      return this._fromValue(type._copy(any, opts));
    default: // Normal copy.
      return this._fromValue(type._copy(this._toValue(any), opts));
  }
};

LogicalType.prototype._update = function (resolver, type, opts) {
  var _fromValue = this._resolve(type, opts);
  if (_fromValue) {
    resolver._read = function (tap) { return _fromValue(type._read(tap)); };
  }
};

LogicalType.prototype.compare = function (obj1, obj2) {
  var val1 = this._toValue(obj1);
  var val2 = this._toValue(obj2);
  return this.underlyingType.compare(val1, val2);
};

LogicalType.prototype.random = function () {
  return this._fromValue(this.underlyingType.random());
};

LogicalType.prototype._deref = function (schema, opts) {
  var type = this.underlyingType;
  var isVisited = type.name !== undefined && opts.derefed[type.name];
  schema = type._attrs(opts);
  if (!isVisited && opts.exportAttrs) {
    if (typeof schema == 'string') {
      schema = {type: schema};
    }
    schema.logicalType = this._logicalTypeName;
    this._export(schema);
  }
  return schema;
};

LogicalType.prototype._skip = function (tap) {
  this.underlyingType._skip(tap);
};

// Unlike the other methods below, `_export` has a reasonable default which we
// can provide (not exporting anything).
LogicalType.prototype._export = function (/* schema */) {};

// Methods to be implemented.
LogicalType.prototype._fromValue = utils.abstractFunction;
LogicalType.prototype._toValue = utils.abstractFunction;
LogicalType.prototype._resolve = utils.abstractFunction;


// General helpers.

/**
 * Customizable long.
 *
 * This allows support of arbitrarily large long (e.g. larger than
 * `Number.MAX_SAFE_INTEGER`). See `LongType.__with` method above. Note that we
 * can't use a logical type because we need a "lower-level" hook here: passing
 * through through the standard long would cause a loss of precision.
 */
function AbstractLongType(noUnpack) {
  PrimitiveType.call(this, true);
  // Note that this type "inherits" `LongType` (i.e. gain its prototype
  // methods) but only "subclasses" `PrimitiveType` to avoid being prematurely
  // frozen.
  this._noUnpack = !!noUnpack;
}
util.inherits(AbstractLongType, LongType);

AbstractLongType.prototype._check = function (val, flags, hook) {
  var b = this._isValid(val);
  if (!b && hook) {
    hook(val, this);
  }
  return b;
};

AbstractLongType.prototype._read = function (tap) {
  var buf, pos;
  if (this._noUnpack) {
    pos = tap.pos;
    tap.skipLong();
    buf = tap.buf.slice(pos, tap.pos);
  } else {
    buf = tap.unpackLongBytes(tap);
  }
  if (tap.isValid()) {
    return this._fromBuffer(buf);
  }
};

AbstractLongType.prototype._write = function (tap, val) {
  if (!this._isValid(val)) {
    throwInvalidError(val, this);
  }
  var buf = this._toBuffer(val);
  if (this._noUnpack) {
    tap.writeFixed(buf);
  } else {
    tap.packLongBytes(buf);
  }
};

AbstractLongType.prototype._copy = function (val, opts) {
  switch (opts && opts.coerce) {
    case 3: // To string.
      return this._toJSON(val);
    case 2: // From string.
      return this._fromJSON(val);
    default: // Normal copy.
      // Slow but guarantees most consistent results. Faster alternatives would
      // require assumptions on the long class used (e.g. immutability).
      return this._fromJSON(this._toJSON(val));
  }
};

AbstractLongType.prototype._update = function (resolver, type) {
  var self = this;
  switch (type.typeName) {
    case 'int':
      resolver._read = function (tap) {
        return self._fromJSON(type._read(tap));
      };
      break;
    case 'long':
      resolver._read = function (tap) { return self._read(tap); };
  }
};

AbstractLongType.prototype.random = function () {
  return this._fromJSON(LongType.prototype.random());
};

// Methods to be implemented by the user.
AbstractLongType.prototype._fromBuffer = utils.abstractFunction;
AbstractLongType.prototype._toBuffer = utils.abstractFunction;
AbstractLongType.prototype._fromJSON = utils.abstractFunction;
AbstractLongType.prototype._toJSON = utils.abstractFunction;
AbstractLongType.prototype._isValid = utils.abstractFunction;
AbstractLongType.prototype.compare = utils.abstractFunction;

/** A record field. */
function Field(schema, opts) {
  var name = schema.name;
  if (typeof name != 'string' || !isValidName(name)) {
    throw new Error(f('invalid field name: %s', name));
  }

  this.name = name;
  this.type = Type.forSchema(schema.type, opts);
  this.aliases = schema.aliases || [];
  this.doc = schema.doc !== undefined ? '' + schema.doc : undefined;

  this._order = (function (order) {
    switch (order) {
      case 'ascending':
        return 1;
      case 'descending':
        return -1;
      case 'ignore':
        return 0;
      default:
        throw new Error(f('invalid order: %j', order));
    }
  })(schema.order === undefined ? 'ascending' : schema.order);

  var value = schema['default'];
  if (value !== undefined) {
    // We need to convert defaults back to a valid format (unions are
    // disallowed in default definitions, only the first type of each union is
    // allowed instead).
    // http://apache-avro.679487.n3.nabble.com/field-union-default-in-Java-td1175327.html
    var type = this.type;
    var val = type._copy(value, {coerce: 2, wrap: 2});
    // The clone call above will throw an error if the default is invalid.
    if (isPrimitive(type.typeName) && type.typeName !== 'bytes') {
      // These are immutable.
      this.defaultValue = function () { return val; };
    } else {
      this.defaultValue = function () { return type._copy(val); };
    }
  }

  Object.freeze(this);
}

Field.prototype.defaultValue = function () {}; // Undefined default.

Object.defineProperty(Field.prototype, 'order', {
  enumerable: true,
  get: function () {
    return ['descending', 'ignore', 'ascending'][this._order + 1];
  }
});

Field.prototype.getAliases = function () { return this.aliases; };

Field.prototype.getDefault = Field.prototype.defaultValue;

Field.prototype.getName = function () { return this.name; };

Field.prototype.getOrder = function () { return this.order; };

Field.prototype.getType = function () { return this.type; };

/**
 * Resolver to read a writer's schema as a new schema.
 *
 * @param readerType {Type} The type to convert to.
 */
function Resolver(readerType) {
  // Add all fields here so that all resolvers share the same hidden class.
  this._readerType = readerType;
  this._read = null;
  this.itemsType = null;
  this.size = 0;
  this.symbols = null;
  this.valuesType = null;
}

Resolver.prototype._peek = Type.prototype._peek;

Resolver.prototype.inspect = function () { return '<Resolver>'; };

/** Mutable hash container. */
function Hash() {
  this.str = undefined;
}

/**
 * Read a value from a tap.
 *
 * @param type {Type} The type to decode.
 * @param tap {Tap} The tap to read from. No checks are performed here.
 * @param resolver {Resolver} Optional resolver. It must match the input type.
 * @param lazy {Boolean} Skip trailing fields when using a resolver.
 */
function readValue(type, tap, resolver, lazy) {
  if (resolver) {
    if (resolver._readerType !== type) {
      throw new Error('invalid resolver');
    }
    return resolver._read(tap, lazy);
  } else {
    return type._read(tap);
  }
}

/**
 * Remove namespace from a name.
 *
 * @param name {String} Full or short name.
 */
function unqualify(name) {
  var parts = name.split('.');
  return parts[parts.length - 1];
}

/**
 * Verify and return fully qualified name.
 *
 * @param name {String} Full or short name. It can be prefixed with a dot to
 * force global namespace.
 * @param namespace {String} Optional namespace.
 */
function qualify(name, namespace) {
  if (~name.indexOf('.')) {
    name = name.replace(/^\./, ''); // Allow absolute referencing.
  } else if (namespace) {
    name = namespace + '.' + name;
  }
  name.split('.').forEach(function (part) {
    if (!isValidName(part)) {
      throw new Error(f('invalid name: %j', name));
    }
  });
  var tail = unqualify(name);
  // Primitives are always in the global namespace.
  return isPrimitive(tail) ? tail : name;
}

/**
 * Get all aliases for a type (including its name).
 *
 * @param obj {Type|Object} Typically a type or a field. Its aliases property
 * must exist and be an array.
 */
function getAliases(obj) {
  var names = {};
  if (obj.name) {
    names[obj.name] = true;
  }
  var aliases = obj.aliases;
  var i, l;
  for (i = 0, l = aliases.length; i < l; i++) {
    names[aliases[i]] = true;
  }
  return Object.keys(names);
}

/**
 * Check whether a type's name is a primitive.
 *
 * @param name {String} Type name (e.g. `'string'`, `'array'`).
 */
function isPrimitive(typeName) {
  // Since we use this module's own `TYPES` object, we can use `instanceof`.
  var type = TYPES[typeName];
  return type && type.prototype instanceof PrimitiveType;
}

/**
 * Return a type's class name from its Avro type name.
 *
 * We can't simply use `constructor.name` since it isn't supported in all
 * browsers.
 *
 * @param typeName {String} Type name.
 */
function getClassName(typeName) {
  if (typeName === 'error') {
    typeName = 'record';
  } else {
    var match = /^([^:]+):(.*)$/.exec(typeName);
    if (match) {
      if (match[1] === 'union') {
        typeName = match[2] + 'Union';
      } else {
        // Logical type.
        typeName = match[1];
      }
    }
  }
  return utils.capitalize(typeName) + 'Type';
}

/**
 * Get the number of elements in an array block.
 *
 * @param tap {Tap} A tap positioned at the beginning of an array block.
 */
function readArraySize(tap) {
  var n = tap.readLong();
  if (n < 0) {
    n = -n;
    tap.skipLong(); // Skip size.
  }
  return n;
}

/**
 * Check whether a long can be represented without precision loss.
 *
 * @param n {Number} The number.
 *
 * Two things to note:
 *
 * + We are not using the `Number` constants for compatibility with older
 *   browsers.
 * + We must remove one from each bound because of rounding errors.
 */
function isSafeLong(n) {
  return n >= -9007199254740990 && n <= 9007199254740990;
}

/**
 * Check whether an object is the JSON representation of a buffer.
 */
function isJsonBuffer(obj) {
  return obj && obj.type === 'Buffer' && Array.isArray(obj.data);
}

/**
 * Check whether a string is a valid Avro identifier.
 */
function isValidName(str) { return NAME_PATTERN.test(str); }

/**
 * Throw a somewhat helpful error on invalid object.
 *
 * @param path {Array} Passed from hook, but unused (because empty where this
 * function is used, since we aren't keeping track of it for effiency).
 * @param val {...} The object to reject.
 * @param type {Type} The type to check against.
 *
 * This method is mostly used from `_write` to signal an invalid object for a
 * given type. Note that this provides less information than calling `isValid`
 * with a hook since the path is not propagated (for efficiency reasons).
 */
function throwInvalidError(val, type) {
  throw new Error(f('invalid %s: %j', type, val));
}

/**
 * Get a type's bucket when included inside an unwrapped union.
 *
 * @param type {Type} Any type.
 */
function getTypeBucket(type) {
  var typeName = type.typeName;
  switch (typeName) {
    case 'double':
    case 'float':
    case 'int':
    case 'long':
      return 'number';
    case 'bytes':
    case 'fixed':
      return 'buffer';
    case 'enum':
      return 'string';
    case 'map':
    case 'error':
    case 'record':
      return 'object';
    default:
      return typeName;
  }
}

/**
 * Infer a value's bucket (see unwrapped unions for more details).
 *
 * @param val {...} Any value.
 */
function getValueBucket(val) {
  if (val === null) {
    return 'null';
  }
  var bucket = typeof val;
  if (bucket === 'object') {
    // Could be bytes, fixed, array, map, or record.
    if (Array.isArray(val)) {
      return 'array';
    } else if (Buffer.isBuffer(val)) {
      return 'buffer';
    }
  }
  return bucket;
}

/**
 * Check whether a collection of types leads to an ambiguous union.
 *
 * @param types {Array} Array of types.
 */
function isAmbiguous(types) {
  var buckets = {};
  var i, l, bucket, type;
  for (i = 0, l = types.length; i < l; i++) {
    type = types[i];
    if (!Type.isType(type, 'logical')) {
      bucket = getTypeBucket(type);
      if (buckets[bucket]) {
        return true;
      }
      buckets[bucket] = true;
    }
  }
  return false;
}

/**
 * Combine number types.
 *
 * Note that never have to create a new type here, we are guaranteed to be able
 * to reuse one of the input types as super-type.
 */
function combineNumbers(types) {
  var typeNames = ['int', 'long', 'float', 'double'];
  var superIndex = -1;
  var superType = null;
  var i, l, type, index;
  for (i = 0, l = types.length; i < l; i++) {
    type = types[i];
    index = typeNames.indexOf(type.typeName);
    if (index > superIndex) {
      superIndex = index;
      superType = type;
    }
  }
  return superType;
}

/**
 * Combine enums and strings.
 *
 * The order of the returned symbols is undefined and the returned enum is
 *
 */
function combineStrings(types, opts) {
  var symbols = {};
  var i, l, type, typeSymbols;
  for (i = 0, l = types.length; i < l; i++) {
    type = types[i];
    if (type.typeName === 'string') {
      // If at least one of the types is a string, it will be the supertype.
      return type;
    }
    typeSymbols = type.symbols;
    var j, m;
    for (j = 0, m = typeSymbols.length; j < m; j++) {
      symbols[typeSymbols[j]] = true;
    }
  }
  return Type.forSchema({type: 'enum', symbols: Object.keys(symbols)}, opts);
}

/**
 * Combine bytes and fixed.
 *
 * This function is optimized to avoid creating new types when possible: in
 * case of a size mismatch between fixed types, it will continue looking
 * through the array to find an existing bytes type (rather than exit early by
 * creating one eagerly).
 */
function combineBuffers(types, opts) {
  var size = -1;
  var i, l, type;
  for (i = 0, l = types.length; i < l; i++) {
    type = types[i];
    if (type.typeName === 'bytes') {
      return type;
    }
    if (size === -1) {
      size = type.size;
    } else if (type.size !== size) {
      // Don't create a bytes type right away, we might be able to reuse one
      // later on in the types array. Just mark this for now.
      size = -2;
    }
  }
  return size < 0 ? Type.forSchema('bytes', opts) : types[0];
}

/**
 * Combine maps and records.
 *
 * Field defaults are kept when possible (i.e. when no coercion to a map
 * happens), with later definitions overriding previous ones.
 */
function combineObjects(types, opts) {
  var allTypes = []; // Field and value types.
  var fieldTypes = {}; // Record field types grouped by field name.
  var fieldDefaults = {};
  var isValidRecord = true;

  // Check whether the final type will be a map or a record.
  var i, l, type, fields;
  for (i = 0, l = types.length; i < l; i++) {
    type = types[i];
    if (type.typeName === 'map') {
      isValidRecord = false;
      allTypes.push(type.valuesType);
    } else {
      fields = type.fields;
      var j, m, field, fieldDefault, fieldName, fieldType;
      for (j = 0, m = fields.length; j < m; j++) {
        field = fields[j];
        fieldName = field.name;
        fieldType = field.type;
        allTypes.push(fieldType);
        if (isValidRecord) {
          if (!fieldTypes[fieldName]) {
            fieldTypes[fieldName] = [];
          }
          fieldTypes[fieldName].push(fieldType);
          fieldDefault = field.defaultValue();
          if (fieldDefault !== undefined) {
            // Later defaults will override any previous ones.
            fieldDefaults[fieldName] = fieldDefault;
          }
        }
      }
    }
  }

  if (isValidRecord) {
    // Check that no fields are missing and that we have the approriate
    // defaults for those which are.
    var fieldNames = Object.keys(fieldTypes);
    for (i = 0, l = fieldNames.length; i < l; i++) {
      fieldName = fieldNames[i];
      if (
        fieldTypes[fieldName].length < types.length &&
        fieldDefaults[fieldName] === undefined
      ) {
        // At least one of the records is missing a field with no default.
        if (opts && opts.strictDefaults) {
          isValidRecord = false;
        } else {
          fieldTypes[fieldName].unshift(Type.forSchema('null', opts));
          fieldDefaults[fieldName] = null;
        }
      }
    }
  }

  var schema;
  if (isValidRecord) {
    schema = {
      type: 'record',
      fields: fieldNames.map(function (s) {
        var fieldType = Type.forTypes(fieldTypes[s], opts);
        var fieldDefault = fieldDefaults[s];
        if (
          fieldDefault !== undefined &&
          ~fieldType.typeName.indexOf('union')
        ) {
          // Ensure that the default's corresponding type is first.
          var unionTypes = fieldType.types.slice();
          var i, l;
          for (i = 0, l = unionTypes.length; i < l; i++) {
            if (unionTypes[i].isValid(fieldDefault)) {
              break;
            }
          }
          if (i > 0) {
            var unionType = unionTypes[0];
            unionTypes[0] = unionTypes[i];
            unionTypes[i] = unionType;
            fieldType = Type.forSchema(unionTypes, opts);
          }
        }
        return {
          name: s,
          type: fieldType,
          'default': fieldDefaults[s]
        };
      })
    };
  } else {
    schema = {
      type: 'map',
      values: Type.forTypes(allTypes, opts)
    };
  }
  return Type.forSchema(schema, opts);
}


module.exports = {
  Type: Type,
  getTypeBucket: getTypeBucket,
  getValueBucket: getValueBucket,
  isPrimitive: isPrimitive,
  isValidName: isValidName,
  qualify: qualify,
  builtins: (function () {
    var types = {
      LogicalType: LogicalType,
      UnwrappedUnionType: UnwrappedUnionType,
      WrappedUnionType: WrappedUnionType
    };
    var typeNames = Object.keys(TYPES);
    var i, l, typeName;
    for (i = 0, l = typeNames.length; i < l; i++) {
      typeName = typeNames[i];
      types[getClassName(typeName)] = TYPES[typeName];
    }
    return types;
  })()
};

}).call(this,require("buffer").Buffer)
},{"./utils":4,"buffer":6,"util":11}],4:[function(require,module,exports){
(function (Buffer){
/* jshint node: true */

// TODO: Make long comparison impervious to precision loss.
// TODO: Optimize binary comparison methods.

'use strict';

/** Various utilities used across this library. */

var crypto = require('crypto');
var util = require('util');

// Shared buffer pool for all taps.
var POOL = new BufferPool(4096);


/**
 * Uppercase the first letter of a string.
 *
 * @param s {String} The string.
 */
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/**
 * Compare two numbers.
 *
 * @param n1 {Number} The first one.
 * @param n2 {Number} The second one.
 */
function compare(n1, n2) { return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1); }

/**
 * Get option or default if undefined.
 *
 * @param opts {Object} Options.
 * @param key {String} Name of the option.
 * @param def {...} Default value.
 *
 * This is useful mostly for true-ish defaults and false-ish values (where the
 * usual `||` idiom breaks down).
 */
function getOption(opts, key, def) {
  var value = opts[key];
  return value === undefined ? def : value;
}

/**
 * Compute a string's hash.
 *
 * @param str {String} The string to hash.
 * @param algorithm {String} The algorithm used. Defaults to MD5.
 */
function getHash(str, algorithm) {
  algorithm = algorithm || 'md5';
  var hash = crypto.createHash(algorithm);
  hash.end(str);
  return hash.read();
}

/**
 * Find index of value in array.
 *
 * @param arr {Array} Can also be a false-ish value.
 * @param v {Object} Value to find.
 *
 * Returns -1 if not found, -2 if found multiple times.
 */
function singleIndexOf(arr, v) {
  var pos = -1;
  var i, l;
  if (!arr) {
    return -1;
  }
  for (i = 0, l = arr.length; i < l; i++) {
    if (arr[i] === v) {
      if (pos >= 0) {
        return -2;
      }
      pos = i;
    }
  }
  return pos;
}

/**
 * Convert array to map.
 *
 * @param arr {Array} Elements.
 * @param fn {Function} Function returning an element's key.
 */
function toMap(arr, fn) {
  var obj = {};
  var i, elem;
  for (i = 0; i < arr.length; i++) {
    elem = arr[i];
    obj[fn(elem)] = elem;
  }
  return obj;
}

/**
 * Convert map to array of values (polyfill for `Object.values`).
 *
 * @param obj {Object} Map.
 */
function objectValues(obj) {
  return Object.keys(obj).map(function (key) { return obj[key]; });
}

/**
 * Check whether an array has duplicates.
 *
 * @param arr {Array} The array.
 * @param fn {Function} Optional function to apply to each element.
 */
function hasDuplicates(arr, fn) {
  var obj = {};
  var i, l, elem;
  for (i = 0, l = arr.length; i < l; i++) {
    elem = arr[i];
    if (fn) {
      elem = fn(elem);
    }
    if (obj[elem]) {
      return true;
    }
    obj[elem] = true;
  }
  return false;
}

/**
 * Copy properties from one object to another.
 *
 * @param src {Object} The source object.
 * @param dst {Object} The destination object.
 * @param overwrite {Boolean} Whether to overwrite existing destination
 * properties. Defaults to false.
 */
function copyOwnProperties(src, dst, overwrite) {
  var names = Object.getOwnPropertyNames(src);
  var i, l, name;
  for (i = 0, l = names.length; i < l; i++) {
    name = names[i];
    if (!dst.hasOwnProperty(name) || overwrite) {
      var descriptor = Object.getOwnPropertyDescriptor(src, name);
      Object.defineProperty(dst, name, descriptor);
    }
  }
  return dst;
}

/**
 * Returns offset in the string of the end of JSON object (-1 if past the end).
 *
 * To keep the implementation simple, this function isn't a JSON validator. It
 * will gladly return a result for invalid JSON (which is OK since that will be
 * promptly rejected by the JSON parser). What matters is that it is guaranteed
 * to return the correct end when presented with valid JSON.
 *
 * @param str {String} Input string containing serialized JSON..
 * @param pos {Number} Starting position.
 */
function jsonEnd(str, pos) {
  pos = pos | 0;

  // Handle the case of a simple literal separately.
  var c = str.charAt(pos++);
  if (/[\d-]/.test(c)) {
    while (/[eE\d.+-]/.test(str.charAt(pos))) {
      pos++;
    }
    return pos;
  } else if (/true|null/.test(str.slice(pos - 1, pos + 3))) {
    return pos + 3;
  } else if (/false/.test(str.slice(pos - 1, pos + 4))) {
    return pos + 4;
  }

  // String, object, or array.
  var depth = 0;
  var literal = false;
  do {
    switch (c) {
    case '{':
    case '[':
      if (!literal) { depth++; }
      break;
    case '}':
    case ']':
      if (!literal && !--depth) {
        return pos;
      }
      break;
    case '"':
      literal = !literal;
      if (!depth && !literal) {
        return pos;
      }
      break;
    case '\\':
      pos++; // Skip the next character.
    }
  } while ((c = str.charAt(pos++)));

  return -1;
}

/** "Abstract" function to help with "subclassing". */
function abstractFunction() { throw new Error('abstract'); }

/** Batch-deprecate "getters" from an object's prototype. */
function addDeprecatedGetters(obj, props) {
  var proto = obj.prototype;
  var i, l, prop, getter;
  for (i = 0, l = props.length; i < l; i++) {
    prop = props[i];
    getter = 'get' + capitalize(prop);
    proto[getter] = util.deprecate(
      createGetter(prop),
      'use `.' + prop + '` instead of `.' + getter + '()`'
    );
  }

  function createGetter(prop) {
    return function () {
      var delegate = this[prop];
      return typeof delegate == 'function' ?
        delegate.apply(this, arguments) :
        delegate;
    };
  }
}

/**
 * Simple buffer pool to avoid allocating many small buffers.
 *
 * This provides significant speedups in recent versions of node (6+).
 */
function BufferPool(len) {
  this._len = len | 0;
  this._pos = 0;
  this._slab = new Buffer(this._len);
}

BufferPool.prototype.alloc = function (len) {
  var maxLen = this._len;
  if (len > maxLen) {
    return new Buffer(len);
  }
  if (this._pos + len > maxLen) {
    this._slab = new Buffer(maxLen);
    this._pos = 0;
  }
  return this._slab.slice(this._pos, this._pos += len);
};

/**
 * Generator of random things.
 *
 * Inspired by: http://stackoverflow.com/a/424445/1062617
 */
function Lcg(seed) {
  var a = 1103515245;
  var c = 12345;
  var m = Math.pow(2, 31);
  var state = Math.floor(seed || Math.random() * (m - 1));

  this._max = m;
  this._nextInt = function () { return state = (a * state + c) % m; };
}

Lcg.prototype.nextBoolean = function () {
  // jshint -W018
  return !!(this._nextInt() % 2);
};

Lcg.prototype.nextInt = function (start, end) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  end = end === undefined ? this._max : end;
  return start + Math.floor(this.nextFloat() * (end - start));
};

Lcg.prototype.nextFloat = function (start, end) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  end = end === undefined ? 1 : end;
  return start + (end - start) * this._nextInt() / this._max;
};

Lcg.prototype.nextString = function(len, flags) {
  len |= 0;
  flags = flags || 'aA';
  var mask = '';
  if (flags.indexOf('a') > -1) {
    mask += 'abcdefghijklmnopqrstuvwxyz';
  }
  if (flags.indexOf('A') > -1) {
    mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (flags.indexOf('#') > -1) {
    mask += '0123456789';
  }
  if (flags.indexOf('!') > -1) {
    mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  }
  var result = [];
  for (var i = 0; i < len; i++) {
    result.push(this.choice(mask));
  }
  return result.join('');
};

Lcg.prototype.nextBuffer = function (len) {
  var arr = [];
  var i;
  for (i = 0; i < len; i++) {
    arr.push(this.nextInt(256));
  }
  return new Buffer(arr);
};

Lcg.prototype.choice = function (arr) {
  var len = arr.length;
  if (!len) {
    throw new Error('choosing from empty array');
  }
  return arr[this.nextInt(len)];
};

/**
 * Ordered queue which returns items consecutively.
 *
 * This is actually a heap by index, with the added requirements that elements
 * can only be retrieved consecutively.
 */
function OrderedQueue() {
  this._index = 0;
  this._items = [];
}

OrderedQueue.prototype.push = function (item) {
  var items = this._items;
  var i = items.length | 0;
  var j;
  items.push(item);
  while (i > 0 && items[i].index < items[j = ((i - 1) >> 1)].index) {
    item = items[i];
    items[i] = items[j];
    items[j] = item;
    i = j;
  }
};

OrderedQueue.prototype.pop = function () {
  var items = this._items;
  var len = (items.length - 1) | 0;
  var first = items[0];
  if (!first || first.index > this._index) {
    return null;
  }
  this._index++;
  if (!len) {
    items.pop();
    return first;
  }
  items[0] = items.pop();
  var mid = len >> 1;
  var i = 0;
  var i1, i2, j, item, c, c1, c2;
  while (i < mid) {
    item = items[i];
    i1 = (i << 1) + 1;
    i2 = (i + 1) << 1;
    c1 = items[i1];
    c2 = items[i2];
    if (!c2 || c1.index <= c2.index) {
      c = c1;
      j = i1;
    } else {
      c = c2;
      j = i2;
    }
    if (c.index >= item.index) {
      break;
    }
    items[j] = item;
    items[i] = c;
    i = j;
  }
  return first;
};

/**
 * A tap is a buffer which remembers what has been already read.
 *
 * It is optimized for performance, at the cost of failing silently when
 * overflowing the buffer. This is a purposeful trade-off given the expected
 * rarity of this case and the large performance hit necessary to enforce
 * validity. See `isValid` below for more information.
 */
function Tap(buf, pos) {
  this.buf = buf;
  this.pos = pos | 0;
  if (this.pos < 0) {
    throw new Error('negative offset');
  }
}

/**
 * Check that the tap is in a valid state.
 *
 * For efficiency reasons, none of the methods below will fail if an overflow
 * occurs (either read, skip, or write). For this reason, it is up to the
 * caller to always check that the read, skip, or write was valid by calling
 * this method.
 */
Tap.prototype.isValid = function () { return this.pos <= this.buf.length; };

// Read, skip, write methods.
//
// These should fail silently when the buffer overflows. Note this is only
// required to be true when the functions are decoding valid objects. For
// example errors will still be thrown if a bad count is read, leading to a
// negative position offset (which will typically cause a failure in
// `readFixed`).

Tap.prototype.readBoolean = function () { return !!this.buf[this.pos++]; };

Tap.prototype.skipBoolean = function () { this.pos++; };

Tap.prototype.writeBoolean = function (b) { this.buf[this.pos++] = !!b; };

Tap.prototype.readInt = Tap.prototype.readLong = function () {
  var n = 0;
  var k = 0;
  var buf = this.buf;
  var b, h, f, fk;

  do {
    b = buf[this.pos++];
    h = b & 0x80;
    n |= (b & 0x7f) << k;
    k += 7;
  } while (h && k < 28);

  if (h) {
    // Switch to float arithmetic, otherwise we might overflow.
    f = n;
    fk = 268435456; // 2 ** 28.
    do {
      b = buf[this.pos++];
      f += (b & 0x7f) * fk;
      fk *= 128;
    } while (b & 0x80);
    return (f % 2 ? -(f + 1) : f) / 2;
  }

  return (n >> 1) ^ -(n & 1);
};

Tap.prototype.skipInt = Tap.prototype.skipLong = function () {
  var buf = this.buf;
  while (buf[this.pos++] & 0x80) {}
};

Tap.prototype.writeInt = Tap.prototype.writeLong = function (n) {
  var buf = this.buf;
  var f, m;

  if (n >= -1073741824 && n < 1073741824) {
    // Won't overflow, we can use integer arithmetic.
    m = n >= 0 ? n << 1 : (~n << 1) | 1;
    do {
      buf[this.pos] = m & 0x7f;
      m >>= 7;
    } while (m && (buf[this.pos++] |= 0x80));
  } else {
    // We have to use slower floating arithmetic.
    f = n >= 0 ? n * 2 : (-n * 2) - 1;
    do {
      buf[this.pos] = f & 0x7f;
      f /= 128;
    } while (f >= 1 && (buf[this.pos++] |= 0x80));
  }
  this.pos++;
};

Tap.prototype.readFloat = function () {
  var buf = this.buf;
  var pos = this.pos;
  this.pos += 4;
  if (this.pos > buf.length) {
    return;
  }
  return this.buf.readFloatLE(pos);
};

Tap.prototype.skipFloat = function () { this.pos += 4; };

Tap.prototype.writeFloat = function (f) {
  var buf = this.buf;
  var pos = this.pos;
  this.pos += 4;
  if (this.pos > buf.length) {
    return;
  }
  return this.buf.writeFloatLE(f, pos);
};

Tap.prototype.readDouble = function () {
  var buf = this.buf;
  var pos = this.pos;
  this.pos += 8;
  if (this.pos > buf.length) {
    return;
  }
  return this.buf.readDoubleLE(pos);
};

Tap.prototype.skipDouble = function () { this.pos += 8; };

Tap.prototype.writeDouble = function (d) {
  var buf = this.buf;
  var pos = this.pos;
  this.pos += 8;
  if (this.pos > buf.length) {
    return;
  }
  return this.buf.writeDoubleLE(d, pos);
};

Tap.prototype.readFixed = function (len) {
  var pos = this.pos;
  this.pos += len;
  if (this.pos > this.buf.length) {
    return;
  }
  var fixed = POOL.alloc(len);
  this.buf.copy(fixed, 0, pos, pos + len);
  return fixed;
};

Tap.prototype.skipFixed = function (len) { this.pos += len; };

Tap.prototype.writeFixed = function (buf, len) {
  len = len || buf.length;
  var pos = this.pos;
  this.pos += len;
  if (this.pos > this.buf.length) {
    return;
  }
  buf.copy(this.buf, pos, 0, len);
};

Tap.prototype.readBytes = function () {
  return this.readFixed(this.readLong());
};

Tap.prototype.skipBytes = function () {
  var len = this.readLong();
  this.pos += len;
};

Tap.prototype.writeBytes = function (buf) {
  var len = buf.length;
  this.writeLong(len);
  this.writeFixed(buf, len);
};

/* istanbul ignore else */
if (typeof Buffer.prototype.utf8Slice == 'function') {
  // Use this optimized function when available.
  Tap.prototype.readString = function () {
    var len = this.readLong();
    var pos = this.pos;
    var buf = this.buf;
    this.pos += len;
    if (this.pos > buf.length) {
      return;
    }
    return this.buf.utf8Slice(pos, pos + len);
  };
} else {
  Tap.prototype.readString = function () {
    var len = this.readLong();
    var pos = this.pos;
    var buf = this.buf;
    this.pos += len;
    if (this.pos > buf.length) {
      return;
    }
    return this.buf.slice(pos, pos + len).toString();
  };
}

Tap.prototype.skipString = function () {
  var len = this.readLong();
  this.pos += len;
};

Tap.prototype.writeString = function (s) {
  var len = Buffer.byteLength(s);
  var buf = this.buf;
  this.writeLong(len);
  var pos = this.pos;
  this.pos += len;
  if (this.pos > buf.length) {
    return;
  }
  if (len > 64) {
    this._writeUtf8(s, len);
  } else {
    var i, l, c1, c2;
    for (i = 0, l = len; i < l; i++) {
      c1 = s.charCodeAt(i);
      if (c1 < 0x80) {
        buf[pos++] = c1;
      } else if (c1 < 0x800) {
        buf[pos++] = c1 >> 6 | 0xc0;
        buf[pos++] = c1 & 0x3f | 0x80;
      } else if (
        (c1 & 0xfc00) === 0xd800 &&
        ((c2 = s.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
      ) {
        c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
        i++;
        buf[pos++] = c1 >> 18 | 0xf0;
        buf[pos++] = c1 >> 12 & 0x3f | 0x80;
        buf[pos++] = c1 >> 6 & 0x3f | 0x80;
        buf[pos++] = c1 & 0x3f | 0x80;
      } else {
        buf[pos++] = c1 >> 12 | 0xe0;
        buf[pos++] = c1 >> 6 & 0x3f | 0x80;
        buf[pos++] = c1 & 0x3f | 0x80;
      }
    }
  }
};

/* istanbul ignore else */
if (typeof Buffer.prototype.utf8Write == 'function') {
  Tap.prototype._writeUtf8 = function (str, len) {
    this.buf.utf8Write(str, this.pos - len, len);
  };
} else {
  // `utf8Write` isn't available in the browser.
  Tap.prototype._writeUtf8 = function (str, len) {
    this.buf.write(str, this.pos - len, len, 'utf8');
  };
}

/* istanbul ignore else */
if (typeof Buffer.prototype.latin1Write == 'function') {
  // `binaryWrite` has been renamed to `latin1Write` in Node v6.4.0, see
  // https://github.com/nodejs/node/pull/7111. Note that the `'binary'`
  // encoding argument still works however.
  Tap.prototype.writeBinary = function (str, len) {
    var pos = this.pos;
    this.pos += len;
    if (this.pos > this.buf.length) {
      return;
    }
    this.buf.latin1Write(str, pos, len);
  };
} else if (typeof Buffer.prototype.binaryWrite == 'function') {
  Tap.prototype.writeBinary = function (str, len) {
    var pos = this.pos;
    this.pos += len;
    if (this.pos > this.buf.length) {
      return;
    }
    this.buf.binaryWrite(str, pos, len);
  };
} else {
  // Slowest implementation.
  Tap.prototype.writeBinary = function (s, len) {
    var pos = this.pos;
    this.pos += len;
    if (this.pos > this.buf.length) {
      return;
    }
    this.buf.write(s, pos, len, 'binary');
  };
}

// Binary comparison methods.
//
// These are not guaranteed to consume the objects they are comparing when
// returning a non-zero result (allowing for performance benefits), so no other
// operations should be done on either tap after a compare returns a non-zero
// value. Also, these methods do not have the same silent failure requirement
// as read, skip, and write since they are assumed to be called on valid
// buffers.

Tap.prototype.matchBoolean = function (tap) {
  return this.buf[this.pos++] - tap.buf[tap.pos++];
};

Tap.prototype.matchInt = Tap.prototype.matchLong = function (tap) {
  var n1 = this.readLong();
  var n2 = tap.readLong();
  return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1);
};

Tap.prototype.matchFloat = function (tap) {
  var n1 = this.readFloat();
  var n2 = tap.readFloat();
  return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1);
};

Tap.prototype.matchDouble = function (tap) {
  var n1 = this.readDouble();
  var n2 = tap.readDouble();
  return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1);
};

Tap.prototype.matchFixed = function (tap, len) {
  return this.readFixed(len).compare(tap.readFixed(len));
};

Tap.prototype.matchBytes = Tap.prototype.matchString = function (tap) {
  var l1 = this.readLong();
  var p1 = this.pos;
  this.pos += l1;
  var l2 = tap.readLong();
  var p2 = tap.pos;
  tap.pos += l2;
  var b1 = this.buf.slice(p1, this.pos);
  var b2 = tap.buf.slice(p2, tap.pos);
  return b1.compare(b2);
};

// Functions for supporting custom long classes.
//
// The two following methods allow the long implementations to not have to
// worry about Avro's zigzag encoding, we directly expose longs as unpacked.

Tap.prototype.unpackLongBytes = function () {
  var res = new Buffer(8);
  var n = 0;
  var i = 0; // Byte index in target buffer.
  var j = 6; // Bit offset in current target buffer byte.
  var buf = this.buf;
  var b, neg;

  b = buf[this.pos++];
  neg = b & 1;
  res.fill(0);

  n |= (b & 0x7f) >> 1;
  while (b & 0x80) {
    b = buf[this.pos++];
    n |= (b & 0x7f) << j;
    j += 7;
    if (j >= 8) {
      // Flush byte.
      j -= 8;
      res[i++] = n;
      n >>= 8;
    }
  }
  res[i] = n;

  if (neg) {
    invert(res, 8);
  }

  return res;
};

Tap.prototype.packLongBytes = function (buf) {
  var neg = (buf[7] & 0x80) >> 7;
  var res = this.buf;
  var j = 1;
  var k = 0;
  var m = 3;
  var n;

  if (neg) {
    invert(buf, 8);
    n = 1;
  } else {
    n = 0;
  }

  var parts = [
    buf.readUIntLE(0, 3),
    buf.readUIntLE(3, 3),
    buf.readUIntLE(6, 2)
  ];
  // Not reading more than 24 bits because we need to be able to combine the
  // "carry" bits from the previous part and JavaScript only supports bitwise
  // operations on 32 bit integers.
  while (m && !parts[--m]) {} // Skip trailing 0s.

  // Leading parts (if any), we never bail early here since we need the
  // continuation bit to be set.
  while (k < m) {
    n |= parts[k++] << j;
    j += 24;
    while (j > 7) {
      res[this.pos++] = (n & 0x7f) | 0x80;
      n >>= 7;
      j -= 7;
    }
  }

  // Final part, similar to normal packing aside from the initial offset.
  n |= parts[m] << j;
  do {
    res[this.pos] = n & 0x7f;
    n >>= 7;
  } while (n && (res[this.pos++] |= 0x80));
  this.pos++;

  // Restore original buffer (could make this optional?).
  if (neg) {
    invert(buf, 8);
  }
};

// Helpers.

/**
 * Invert all bits in a buffer.
 *
 * @param buf {Buffer} Non-empty buffer to invert.
 * @param len {Number} Buffer length (must be positive).
 */
function invert(buf, len) {
  while (len--) {
    buf[len] = ~buf[len];
  }
}


module.exports = {
  abstractFunction: abstractFunction,
  addDeprecatedGetters: addDeprecatedGetters,
  capitalize: capitalize,
  copyOwnProperties: copyOwnProperties,
  getHash: getHash,
  compare: compare,
  getOption: getOption,
  jsonEnd: jsonEnd,
  objectValues: objectValues,
  toMap: toMap,
  singleIndexOf: singleIndexOf,
  hasDuplicates: hasDuplicates,
  Lcg: Lcg,
  OrderedQueue: OrderedQueue,
  Tap: Tap
};

}).call(this,require("buffer").Buffer)
},{"buffer":6,"crypto":2,"util":11}],5:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],6:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (ArrayBuffer.isView(buf)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":5,"ieee754":7}],7:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],9:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],10:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],11:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":10,"_process":9,"inherits":8}],12:[function(require,module,exports){
const avro = require('avsc/etc/browser/avsc-types');
const schema = require('./avro.schema');

window.avro = avro;

window.avroBaseSchema = schema.exampleBase;
window.avro1KSchema = schema.example1K;
window.avro10KSchema = schema.example10K;

},{"./avro.schema":13,"avsc/etc/browser/avsc-types":1}],13:[function(require,module,exports){
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

},{"avsc/etc/browser/avsc-types":1}]},{},[12]);
