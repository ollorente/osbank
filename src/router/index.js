import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/**/ "../views/Home.vue")
  },
  {
    path: "/gastos",
    name: "Expenses",
    component: () => import(/**/ "../views/expense/Expenses.vue")
  },
  {
    path: "/gastos/nuevo",
    name: "NewExpense",
    component: () => import(/**/ "../views/expense/NewExpense.vue")
  },
  {
    path: "/gastos/:expense",
    name: "Expense",
    component: () => import(/**/ "../views/expense/Expense.vue")
  },
  {
    path: "/gastos/:expense/editar",
    name: "EditExpense",
    component: () => import(/**/ "../views/expense/EditExpense.vue")
  },
  {
    path: "/ingresos",
    name: "Entries",
    component: () => import(/**/ "../views/entry/Entries.vue")
  },
  {
    path: "/ingresos/nuevo",
    name: "NewEntry",
    component: () => import(/**/ "../views/entry/NewEntry.vue")
  },
  {
    path: "/ingresos/:entry",
    name: "Entry",
    component: () => import(/**/ "../views/entry/Entry.vue")
  },
  {
    path: "/ingresos/:entry/editar",
    name: "EditEntry",
    component: () => import(/**/ "../views/entry/EditEntry.vue")
  },
  {
    path: "/items",
    name: "Items",
    component: () => import(/**/ "../views/item/Items.vue")
  },
  {
    path: "/items/nuevo",
    name: "NewItem",
    component: () => import(/**/ "../views/item/NewItem.vue")
  },
  {
    path: "/items/:item",
    name: "Item",
    component: () => import(/**/ "../views/item/Item.vue")
  },
  {
    path: "/items/:item/editar",
    name: "EditItem",
    component: () => import(/**/ "../views/item/EditItem.vue")
  },
  {
    path: "/presupuesto",
    name: "Estimates",
    component: () => import(/**/ "../views/estimate/Estimates.vue")
  },
  {
    path: "/presupuesto/nuevo",
    name: "NewEstimate",
    component: () => import(/**/ "../views/estimate/NewEstimate.vue")
  },
  {
    path: "/presupuesto/:estimate",
    name: "Estimate",
    component: () => import(/**/ "../views/estimate/Estimate.vue")
  },
  {
    path: "/presupuesto/:estimate/editar",
    name: "EditEstimate",
    component: () => import(/**/ "../views/estimate/EditEstimate.vue")
  },
  {
    path: "/*",
    name: "NotFound",
    component: () => import(/**/ "../views/NotFound.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
