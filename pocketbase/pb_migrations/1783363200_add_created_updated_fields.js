/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const names = [
    "anime", "manga", "endings", "openings", "soundtracks",
    "characters", "artists", "albums", "tracks",
  ]

  for (const name of names) {
    const collection = app.findCollectionByNameOrId(name)

    collection.fields.add(new Field({
      name: "created",
      type: "autodate",
      onCreate: true,
    }))

    collection.fields.add(new Field({
      name: "updated",
      type: "autodate",
      onCreate: true,
      onUpdate: true,
    }))

    app.save(collection)
  }
}, (app) => {
  const names = [
    "anime", "manga", "endings", "openings", "soundtracks",
    "characters", "artists", "albums", "tracks",
  ]

  for (const name of names) {
    const collection = app.findCollectionByNameOrId(name)
    collection.fields.removeByName("created")
    collection.fields.removeByName("updated")
    app.save(collection)
  }
})
