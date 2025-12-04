import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("admin/login", "routes/admin/login.tsx"),
    layout("routes/admin/layout.tsx", [
        route("admin/dashboard", "routes/admin/dashboard.tsx"),
        route("admin/pages", "routes/admin/pages.tsx"),
        route("admin/pages/new", "routes/admin/pages/new.tsx"),
        route("admin/pages/:id", "routes/admin/pages/$id.tsx"),
        route("admin/music", "routes/admin/music.tsx"),
        route("admin/music/new", "routes/admin/music/new.tsx"),
        route("admin/music/:id", "routes/admin/music/$id.tsx"),
        route("admin/blogs", "routes/admin/blogs.tsx"),
        route("admin/blogs/new", "routes/admin/blogs/new.tsx"),
        route("admin/blogs/:id", "routes/admin/blogs/$id.tsx"),
        route("admin/inquiries", "routes/admin/inquiries.tsx"),
        route("admin/inquiries/:id", "routes/admin/inquiries/$id.tsx"),
        route("admin/api-keys", "routes/admin/api-keys.tsx"),
        route("admin/settings", "routes/admin/settings.tsx"),
        route("admin", "routes/admin/index.tsx"),
    ]),
    route("blog", "routes/blog/index.tsx"),
    route("blog/:slug", "routes/blog/$slug.tsx"),
] satisfies RouteConfig;
