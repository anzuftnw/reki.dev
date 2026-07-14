/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "arknights_operators",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "rarity", type: "number", required: true, min: 1, max: 6 },
      {
        name: "profession",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["Vanguard", "Guard", "Defender", "Sniper", "Caster", "Medic", "Supporter", "Specialist"],
      },
      { name: "subProfession", type: "text", required: true },
      {
        name: "position",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["Melee", "Ranged"],
      },
      { name: "cover", type: "file", required: false },
      { name: "tags", type: "json", required: false },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_arknights_operators_name ON arknights_operators (name)",
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("arknights_operators")
  return app.delete(collection)
})
