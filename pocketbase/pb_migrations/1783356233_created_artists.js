/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "artists",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "cover",
        type: "file",
        required: true,
      },
      {
        name: "rank",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["SS", "S", "A", "B", "C", "D", "E", "F"],
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
  const collection = app.findCollectionByNameOrId("artists")
  return app.delete(collection)
})
