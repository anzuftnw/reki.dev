/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "blog_posts",
    type: "base",
    listRule: "@request.auth.id != \"\" || (publishedAt != \"\" && publishedAt <= @now)",
    viewRule: "@request.auth.id != \"\" || (publishedAt != \"\" && publishedAt <= @now)",
    createRule: "@request.auth.id != \"\"",
    updateRule: "@request.auth.id != \"\"",
    deleteRule: "@request.auth.id != \"\"",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text", required: true },
      { name: "body", type: "text", required: true },
      { name: "excerpt", type: "text", required: false },
      { name: "tags", type: "json", required: false },
      { name: "cover", type: "file", required: false },
      { name: "publishedAt", type: "date", required: false },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_blog_posts_slug ON blog_posts (slug)",
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("blog_posts")
  return app.delete(collection)
})
