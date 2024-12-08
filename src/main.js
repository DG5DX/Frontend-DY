import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/routes.js";
import { Quasar, Notify } from "quasar";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./style.css";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.use(Quasar, {
	plugins: { Notify },
});
app.use(pinia);
app.use(router);
app.mount("#app");
