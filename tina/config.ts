import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "Homepage",
        path: "content/home",
        format: "json",
        ui: {
          router: () => "/",
        },
        fields: [
          {
            type: "object",
            name: "intro",
            label: "Intro",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "avatarImage", label: "Avatar Image" },
              { type: "string", name: "version", label: "Version" },
              { type: "string", name: "updatedYear", label: "Updated Year" },
            ],
          },
          {
            type: "object",
            name: "experience",
            label: "Experience",
            list: true,
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "period", label: "Period" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "company", label: "Company" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "projects",
            label: "Projects",
            list: true,
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "number", label: "Number" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "tags", label: "Tags", list: true },
            ],
          },
        ],
      },
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "md",
        ui: {
          router: ({ document }) => `/projects/${document._sys.filename}`,
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Date" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "subtitle", label: "Subtitle" },
          { type: "string", name: "role", label: "Role" },
          { type: "string", name: "team", label: "Team" },
          { type: "string", name: "tools", label: "Tools" },
          { type: "string", name: "timeline", label: "Timeline" },
          { type: "string", name: "heroImage", label: "Hero Image" },
          { type: "string", name: "tags", label: "Tags", list: true },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "thought",
        label: "Thoughts",
        path: "content/thoughts",
        format: "md",
        ui: {
          router: ({ document }) => `/thoughts/${document._sys.filename}`,
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Date" },
          { type: "string", name: "type", label: "Type" },
          { type: "string", name: "readTime", label: "Read Time" },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
