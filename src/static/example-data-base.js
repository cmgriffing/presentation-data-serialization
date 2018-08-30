const data = {
  "name": "Something",
  "weight": 42,
  "contents": [
    "widgets",
    "cogs"
  ]
};

if(typeof window !== 'undefined') {
  window.EXAMPLE_DATA_BASE = data;
} else {
  module.exports = data;
}
