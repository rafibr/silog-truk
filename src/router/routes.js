import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/e-katalog",
    name: "E-Katalog",
    component: () => import("@/views/EKatalog.vue"),
  },
];

export default routes;
