import { createRouter, createWebHistory } from "vue-router";

const BASE_URL_TITLE = "© OsBank";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: `Home ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/gastos",
    name: "Expenses",
    component: () => import("@/views/expense/Expenses.vue"),
    meta: {
      title: `Gastos ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/gastos/nuevo",
    name: "NewExpense",
    component: () => import("@/views/expense/NewExpense.vue"),
    meta: {
      title: `Nuevo gasto ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/gastos/:expense",
    name: "Expense",
    component: () => import("@/views/expense/Expense.vue"),
    meta: {
      title: `Gasto ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/gastos/:expense/editar",
    name: "EditExpense",
    component: () => import("@/views/expense/EditExpense.vue"),
    meta: {
      title: `Editar gasto ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/ingresos",
    name: "Entries",
    component: () => import("@/views/entry/Entries.vue"),
    meta: {
      title: `Ingresos ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/ingresos/nuevo",
    name: "NewEntry",
    component: () => import("@/views/entry/NewEntry.vue"),
    meta: {
      title: `Nuevo ingreso ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/ingresos/:entry",
    name: "Entry",
    component: () => import("@/views/entry/Entry.vue"),
    meta: {
      title: `Ingreso ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/ingresos/:entry/editar",
    name: "EditEntry",
    component: () => import("@/views/entry/EditEntry.vue"),
    meta: {
      title: `Editar ingreso ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/items",
    name: "Items",
    component: () => import("@/views/item/Items.vue"),
    meta: {
      title: `Ítems ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/items/nuevo",
    name: "NewItem",
    component: () => import("@/views/item/NewItem.vue"),
    meta: {
      title: `Nuevo ítem ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/items/:item",
    name: "Item",
    component: () => import("@/views/item/Item.vue"),
    meta: {
      title: `Ítem ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/items/:item/editar",
    name: "EditItem",
    component: () => import("@/views/item/EditItem.vue"),
    meta: {
      title: `Editar ítem ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/presupuesto",
    name: "Estimates",
    component: () => import("@/views/estimate/Estimates.vue"),
    meta: {
      title: `Presupuesto ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/presupuesto/nuevo",
    name: "NewEstimate",
    component: () => import("@/views/estimate/NewEstimate.vue"),
    meta: {
      title: `Nuevo presupuesto ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/presupuesto/:estimate",
    name: "Estimate",
    component: () => import("@/views/estimate/Estimate.vue"),
    meta: {
      title: `Detalle presupuesto ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/presupuesto/:estimate/editar",
    name: "EditEstimate",
    component: () => import("@/views/estimate/EditEstimate.vue"),
    meta: {
      title: `Editar presupuesto ${BASE_URL_TITLE}`,
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
    },
  },
  {
    path: "/usuarios/nuevo",
    name: "NewUser",
    component: () => import("@/views/user/NewUser.vue"),
    meta: {
      title: `Nuevo usuario ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/usuarios/:user",
    name: "User",
    component: () => import("@/views/user/Users.vue"),
    meta: {
      title: `Detalle usuario ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/usuarios/:user/editar",
    name: "EditUser",
    component: () => import("@/views/user/EditUser.vue"),
    meta: {
      title: `Editar usuario ${BASE_URL_TITLE}`,
    },
  },
  {
    path: "/*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: `Página no encontrada ${BASE_URL_TITLE}`,
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
});

export default router;
