import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/global.css"
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import { locale, setLocale, t, availableLanguages } from "./stores/locale";

const app = createApp(App);
app.config.globalProperties.$locale = locale;
app.config.globalProperties.$setLocale = setLocale;
app.config.globalProperties.$t = t;
app.config.globalProperties.$availableLanguages = availableLanguages;

app.use(router);
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
})
app.mount("#app");