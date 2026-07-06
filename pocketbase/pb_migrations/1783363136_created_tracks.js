/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "tracks",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      {
        name: "title",
        type: "text",
        required: true,
      },
      {
        name: "artist",
        type: "relation",
        required: true,
        collectionId: app.findCollectionByNameOrId("artists").id,
        maxSelect: 999,
      },
      {
        name: "album",
        type: "relation",
        required: false,
        collectionId: app.findCollectionByNameOrId("albums").id,
        maxSelect: 1,
      },
      {
        name: "cover",
        type: "file",
        required: false,
      },
      {
        name: "genre",
        type: "select",
        required: false,
        maxSelect: 1,
        values: ["pop", "rock", "electronic", "jazz", "hip hop", "soundtrack", "other"],
      },
      {
        name: "duration",
        type: "number",
        required: false,
      },
      {
        name: "score",
        type: "number",
        required: false,
        min: 0,
        max: 10,
      },
      {
        name: "scrobbles",
        type: "number",
        required: false,
      },
      {
        name: "notes",
        type: "text",
        required: false,
      },
      {
        name: "favorite",
        type: "bool",
        required: false,
      }
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("tracks")
  return app.delete(collection)
})
