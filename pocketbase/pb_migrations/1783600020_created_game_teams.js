/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "game_teams",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      { name: "game", type: "text", required: true },
      { name: "name", type: "text", required: true },
      { name: "slots", type: "json", required: true },
      { name: "tags", type: "json", required: false },
      { name: "favorite", type: "bool", required: false },
      { name: "notes", type: "text", required: false },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE INDEX idx_game_teams_game ON game_teams (game)",
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("game_teams")
  return app.delete(collection)
})
