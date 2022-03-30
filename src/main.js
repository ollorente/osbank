import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import VueApollo from "vue-apollo";

// App.use(VueApollo);

// const apolloProvider = new VueApollo({
//   defaultClient: apolloClient,
// });

createApp(App).use(router).use(store).mount("#app");
