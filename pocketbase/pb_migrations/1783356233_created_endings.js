/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "endings",
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
        type: "text",
        required: true,
      },
      {
        name: "anime",
        type: "text",
        required: true,
      },
      {
        name: "slot",
        type: "number",
        required: true,
      },
      {
        name: "cover",
        type: "file",
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
  const collection = app.findCollectionByNameOrId("endings")
  return app.delete(collection)
})
