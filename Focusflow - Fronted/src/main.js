import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/global.css"
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

const app = createApp(App);
app.use(router);
app.mount("#app");

app.use(Toast, {
  position: "top-right",
  timeout: 3000,
})