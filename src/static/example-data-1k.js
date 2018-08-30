const example1kData = {
  "id": "5b7a61bb680a3b0356b3f024",
  "index": 0,
  "guid": "d3018fc4-8022-46c4-ac87-ccb69d7f8ab8",
  "isActive": false,
  "balance": "$2,103.41",
  "picture": "http://placehold.it/32x32",
  "age": 32,
  "eyeColor": "green",
  "name": "Morse Sweeney",
  "gender": "male",
  "company": "ORBALIX",
  "email": "morsesweeney@orbalix.com",
  "phone": "+1 (977) 456-3122",
  "address": "838 Beaver Street, Leola, Tennessee, 7289",
  "about": "Eu irure voluptate officia ut adipisicing id quis et commodo occaecat laboris culpa culpa. Aute ut dolor enim magna amet irure pariatur est aliqua magna adipisicing aute ea. Anim velit fugiat esse in id occaecat eu pariatur. Velit proident in adipisicing esse et esse et culpa. Eu commodo sit id aliquip sunt excepteur dolore sunt id labore do nostrud nisi. Adipisicing id magna reprehenderit proident quis laboris laboris sit dolor ea non duis laboris labore.\r\n",
  "registered": "2017-06-22T05:18:11 +07:00",
  "latitude": -73.732187,
  "longitude": 123.37404,
  "tags": [
    "do",
    "incididunt",
    "in",
    "ex",
    "voluptate",
    "laboris",
    "qui"
  ],
  "friends": [
    {
      "id": 0,
      "name": "Hattie Daniel"
    },
    {
      "id": 1,
      "name": "Noreen Bass"
    },
    {
      "id": 2,
      "name": "Felecia Macias"
    }
  ],
  "greeting": "Hello, Morse Sweeney! You have 5 unread messages.",
  "favoriteFruit": "apple"
}

if(typeof window !== 'undefined') {
  window.EXAMPLE_DATA_1K = example1kData;
} else {
  module.exports = example1kData;
}