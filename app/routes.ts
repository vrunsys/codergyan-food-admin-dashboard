import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/root.tsx", [
    layout("layouts/dashboard.tsx", [
      index("routes/home.tsx"),
    ]),
    layout("layouts/NonAuth.tsx", [
      route("auth/login", "routes/login.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
