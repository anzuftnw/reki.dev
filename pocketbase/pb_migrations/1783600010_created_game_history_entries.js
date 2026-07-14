/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "game_history_entries",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      { name: "game", type: "text", required: true },
      { name: "category", type: "text", required: true },
      { name: "occurredAt", type: "date", required: true },
      { name: "label", type: "text", required: true },
      { name: "rarity", type: "number", required: false },
      { name: "isFeatured", type: "bool", required: false },
      { name: "meta", type: "json", required: false },
      { name: "notes", type: "text", required: false },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE INDEX idx_game_history_entries_game_category ON game_history_entries (game, category)",
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("game_history_entries")
  return app.delete(collection)
})
