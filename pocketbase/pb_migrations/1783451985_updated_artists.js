/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4185980916")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select2289690853",
    "maxSelect": 1,
    "name": "rank",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "SS",
      "S",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4185980916")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select2289690853",
    "maxSelect": 1,
    "name": "rank",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "SS",
      "S",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ]
  }))

  return app.save(collection)
})
