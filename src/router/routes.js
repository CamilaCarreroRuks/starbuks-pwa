const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("src/pages/PageHome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/products",
        name: "products",
        component: () => import("src/pages/PageProducts.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/buys",
        name: "buys",
        component: () => import("src/pages/PageRegisterBuys.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/myData",
        name: "myData",
        component: () => import("src/pages/PageMyData.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/shoppingCart",
    name: "shoppingCart",
    component: () => import("src/pages/PageShoppingCart.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "",
    name: "login",
    component: () => import("src/pages/PageLogin.vue"),
    meta: { requiresAuth: false },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/PageError.vue"),
  },
];

export default routes;
