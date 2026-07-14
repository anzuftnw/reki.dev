/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "projects",
    type: "base",
    listRule: "@request.auth.id != \"\" || (publishedAt != \"\" && publishedAt <= @now)",
    viewRule: "@request.auth.id != \"\" || (publishedAt != \"\" && publishedAt <= @now)",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text", required: true },
      { name: "summary", type: "text", required: true },
      { name: "body", type: "text", required: false },
      { name: "cover", type: "file", required: false },
      { name: "codeUrl", type: "url", required: false },
      { name: "liveUrl", type: "url", required: false },
      { name: "tech", type: "json", required: false },
      {
        name: "status",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["wip", "complete", "archived"],
      },
      { name: "featured", type: "bool", required: false },
      { name: "order", type: "number", required: false },
      { name: "publishedAt", type: "date", required: false },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_projects_slug ON projects (slug)",
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("projects")
  return app.delete(collection)
})
