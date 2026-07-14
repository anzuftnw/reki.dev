/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "games",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      { name: "slug", type: "text", required: true },
      { name: "name", type: "text", required: true },
      { name: "cover", type: "file", required: false },
      { name: "tagline", type: "text", required: false },
      { name: "order", type: "number", required: false },
      {
        name: "status",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["active", "paused", "retired"],
      },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_games_slug ON games (slug)",
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("games")
  return app.delete(collection)
})
