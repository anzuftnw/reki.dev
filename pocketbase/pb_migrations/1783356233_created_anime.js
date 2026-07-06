/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "anime",
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
        name: "season",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["winter", "spring", "summer", "fall"],
      },
      {
        name: "year",
        type: "number",
        required: true,
      },
      {
        name: "format",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["tv", "tv short", "movie", "ova", "ona", "special", "music"],
      },
      {
        name: "episodes",
        type: "number",
        required: true,
      },
      {
        name: "episodeLength",
        type: "number",
        required: true,
      },
      {
        name: "genres",
        type: "select",
        required: true,
        maxSelect: 5,
        values: ["action", "adventure", "comedy", "drama", "ecchi", "fantasy", "horror", "mahou shoujo", "mecha", "music", "mystery", "psychological", "romance", "sci-fi", "slice of life", "sports", "supernatural", "thriller"],
      },
      {
        name: "cover",
        type: "file",
        required: true,
      },
      {
        name: "status",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["watching", "rewatching", "completed", "on hold", "dropped", "plan to watch"],
      },
      {
        name: "score",
        type: "number",
        required: false,
        min: 0,
        max: 10,
      },
      {
        name: "episodesWatched",
        type: "number",
        required: false,
      },
      {
        name: "startDate",
        type: "date",
        required: false,
      },
      {
        name: "endDate",
        type: "date",
        required: false,
      },
      {
        name: "rewatchCount",
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
  const collection = app.findCollectionByNameOrId("anime")
  return app.delete(collection)
})
