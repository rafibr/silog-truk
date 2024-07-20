import { registerPlugins } from "@/plugins";
import "@/assets/main.css";
import App from "./App.vue";
import { createApp } from "vue";
import router from "./router";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App);

// app config like app name, version, etc
app.config.globalProperties.$appConfig = {
  name: "Silog-Truk",
  version: "1.0.0",
};


app.component('EasyDataTable', Vue3EasyDataTable);
app.use(router);
app.use(pinia)

registerPlugins(app);

app.mount("#app");
