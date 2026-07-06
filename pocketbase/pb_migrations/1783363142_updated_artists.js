/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artists")

  collection.fields.add(new Field({
    name: "lastfmUrl",
    type: "text",
    required: false,
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("artists")

  collection.fields.removeByName("lastfmUrl")

  return app.save(collection)
})
