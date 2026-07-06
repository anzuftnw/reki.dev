/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "characters",
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
        name: "gender",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["male", "female", "other"],
      },
      {
        name: "dateOfBirth",
        type: "date",
        required: false,
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
  const collection = app.findCollectionByNameOrId("characters")
  return app.delete(collection)
})
