/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("soundtracks")

  collection.fields.add(new Field({
    name: "youtubeUrl",
    type: "text",
    required: false,
  }))

  collection.fields.add(new Field({
    name: "audioFile",
    type: "file",
    required: false,
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("soundtracks")

  collection.fields.removeByName("youtubeUrl")
  collection.fields.removeByName("audioFile")

  return app.save(collection)
})
