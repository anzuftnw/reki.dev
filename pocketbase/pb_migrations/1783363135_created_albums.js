/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "albums",
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
        name: "cover",
        type: "file",
        required: true,
      },
      {
        name: "releaseDate",
        type: "date",
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
  const collection = app.findCollectionByNameOrId("albums")
  return app.delete(collection)
})
