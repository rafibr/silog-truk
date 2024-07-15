import { registerPlugins } from "@/plugins";
import "@/assets/main.css";
import App from "./App.vue";
import { createApp } from "vue";
import router from "./router";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';


const app = createApp(App);
app.use(router);
app.component('EasyDataTable', Vue3EasyDataTable);

registerPlugins(app);

app.mount("#app");
