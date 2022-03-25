import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const BASE_URL_TITLE = "© OsBank";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: `Home ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/gastos",
    name: "Expenses",
    component: () => import("@/views/expense/Expenses.vue"),
    meta: {
      title: `Gastos ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/gastos/nuevo",
    name: "NewExpense",
    component: () => import("@/views/expense/NewExpense.vue"),
    meta: {
      title: `Nuevo gasto ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/gastos/:expense",
    name: "Expense",
    component: () => import("@/views/expense/Expense.vue"),
    meta: {
      title: `Gasto ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/gastos/:expense/editar",
    name: "EditExpense",
    component: () => import("@/views/expense/EditExpense.vue"),
    meta: {
      title: `Editar gasto ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/ingresos",
    name: "Entries",
    component: () => import("@/views/entry/Entries.vue"),
    meta: {
      title: `Ingresos ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/ingresos/nuevo",
    name: "NewEntry",
    component: () => import("@/views/entry/NewEntry.vue"),
    meta: {
      title: `Nuevo ingreso ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/ingresos/:entry",
    name: "Entry",
    component: () => import("@/views/entry/Entry.vue"),
    meta: {
      title: `Ingreso ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/ingresos/:entry/editar",
    name: "EditEntry",
    component: () => import("@/views/entry/EditEntry.vue"),
    meta: {
      title: `Editar ingreso ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/items",
    name: "Items",
    component: () => import("@/views/item/Items.vue"),
    meta: {
      title: `Ítems ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/items/nuevo",
    name: "NewItem",
    component: () => import("@/views/item/NewItem.vue"),
    meta: {
      title: `Nuevo ítem ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/items/:item",
    name: "Item",
    component: () => import("@/views/item/Item.vue"),
    meta: {
      title: `Ítem ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/items/:item/editar",
    name: "EditItem",
    component: () => import("@/views/item/EditItem.vue"),
    meta: {
      title: `Editar ítem ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/presupuesto",
    name: "Estimates",
    component: () => import("@/views/estimate/Estimates.vue"),
    meta: {
      title: `Presupuesto ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/presupuesto/nuevo",
    name: "NewEstimate",
    component: () => import("@/views/estimate/NewEstimate.vue"),
    meta: {
      title: `Nuevo presupuesto ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/presupuesto/:estimate",
    name: "Estimate",
    component: () => import("@/views/estimate/Estimate.vue"),
    meta: {
      title: `Detalle presupuesto ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/presupuesto/:estimate/editar",
    name: "EditEstimate",
    component: () => import("@/views/estimate/EditEstimate.vue"),
    meta: {
      title: `Editar presupuesto ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue"),
    meta: {
      title: `Login ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/registro",
    name: "Logup",
    component: () => import("@/views/auth/Logup.vue"),
    meta: {
      title: `Registro ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/usuarios",
    name: "Users",
    component: () => import("@/views/user/Users.vue"),
    meta: {
      title: `Usuarios ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/perfil",
    name: "Profile",
    component: () => import("@/views/user/Profile.vue"),
    meta: {
      title: `Perfil ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/usuarios/:user/editar",
    name: "EditUser",
    component: () => import("@/views/user/EditUser.vue"),
    meta: {
      title: `Editar usuario ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
  {
    path: "/*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: `Página no encontrada ${BASE_URL_TITLE}`,
      requiredAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();

  const privateRoute = to.matched.some((route) => route.meta.requiredAuth);
// console.log("privateRoute->", privateRoute)
// console.log("TokenGetters->", store.getters.isToken)
// console.log("TokenState->", store.state.token)
// console.log("UserGetters->", store.getters.isUser)
// console.log("UserState->", store.getters.user)
  if (privateRoute || store.state.token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
