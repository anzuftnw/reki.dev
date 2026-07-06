/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("characters")

  collection.fields.add(new Field({
    name: "anilistId",
    type: "number",
    required: false,
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("characters")

  collection.fields.removeByName("anilistId")

  return app.save(collection)
})
