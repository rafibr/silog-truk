import Home from "@/views/Home.vue";

const routes = [
  {
    name: "Home",
    path: "/",
    component: Home,
    auth: false,
    icon: "mdi-home",
  },
  {
    name: "E-Purchasing",
    path: "/e-purchasing",
    component: () => import("@/views/EPurchasing.vue"),
    auth: true,
    icon: "mdi-cart-outline",
  },
  {
    name: "Produk Etalase",
    path: "/produk-etalase",
    component: () => import("@/views/ProdukEtalase.vue"),
    auth: true,
    icon: "mdi-basket-outline",
  },
  {
    name: "Penyedia Produk",
    path: "/penyedia-produk",
    component: () => import("@/views/PenyediaProduk.vue"),
    auth: true,
    icon: "mdi-account-group-outline",
  },
  {
    name: "Data Dukung",
    path: "/data-dukung",
    component: () => import("@/views/DataDukung.vue"),
    auth: true,
    icon: "mdi-database",
  },
];

export default routes;
