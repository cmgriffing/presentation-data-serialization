class Shipment {
  constructor(name, weight, contents) {
    this.name = name;
    this.weight = weight;
    this.contents = contents;
  }
}

// JSON
// {"name": "Somthing", "weight": 42, "contents": ["widgets", "cogs"]}

// Avro
// Something(Bwidgetcogs

// XML
// <?xml version="1.0" encoding="UTF-8" standalone="yes"?><root><name>Something</name><weight>42</weight><contents>widgets</contents><contents>cogs</contents></root>

// Bencode
// d8:contentsl7:widgets4:cogse4:name9:Something6:weighti42ee

// BSON
// O   name    Something weight *   contents     0    widgets 1    cogs   

if(typeof module !== 'undefined' && module.exports) {
  module.exports = Shipment;
}
