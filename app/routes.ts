import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/Root.tsx", [
    layout("layouts/Dashboard.tsx", [
      index("routes/home.tsx"),
      route("users", "routes/users/index.tsx"),
      route("restaurants", "routes/restaurants/index.tsx"),
      route("products", "routes/products/index.tsx"),
      route("coupons", "routes/coupons/index.tsx"),
      route("promos", "routes/promos.tsx"),
    ]),
    layout("layouts/NonAuth.tsx", [
      route("auth/login", "routes/login.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
