/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "arknights_collection",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      {
        name: "operator",
        type: "relation",
        required: true,
        collectionId: app.findCollectionByNameOrId("arknights_operators").id,
        maxSelect: 1,
        cascadeDelete: true,
      },
      // Not required: PocketBase's "required" for numbers rejects the zero value, but
      // elite phase 0 (E0) is a legitimate, common state — most freshly-recruited or
      // low-rarity operators sit at E0 and should still validate.
      { name: "elite", type: "number", required: false, min: 0, max: 2 },
      { name: "level", type: "number", required: true, min: 1 },
      { name: "potential", type: "number", required: true, min: 1, max: 6 },
      { name: "trust", type: "number", required: false, min: 0, max: 200 },
      { name: "skill1Level", type: "number", required: false, min: 1, max: 7 },
      { name: "skill1Mastery", type: "number", required: false, min: 0, max: 3 },
      { name: "skill2Level", type: "number", required: false, min: 1, max: 7 },
      { name: "skill2Mastery", type: "number", required: false, min: 0, max: 3 },
      { name: "skill3Level", type: "number", required: false, min: 1, max: 7 },
      { name: "skill3Mastery", type: "number", required: false, min: 0, max: 3 },
      { name: "module1Tier", type: "number", required: false, min: 0, max: 3 },
      { name: "module2Tier", type: "number", required: false, min: 0, max: 3 },
      { name: "skinsOwned", type: "json", required: false },
      { name: "favorite", type: "bool", required: false },
      { name: "notes", type: "text", required: false },
      { name: "acquiredAt", type: "date", required: false },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_arknights_collection_operator ON arknights_collection (operator)",
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("arknights_collection")
  return app.delete(collection)
})
