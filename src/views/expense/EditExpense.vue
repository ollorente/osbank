<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <form @submit.prevent="updateExpense">
          <div class="py-2">
            <label for="name" class="font-semibold ml-3">Nombre *</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="name"
              v-model="expense.name"
              placeholder="Nombre *"
              autofocus
              required
            />
          </div>
          <div class="py-2">
            <label for="icon" class="font-semibold ml-3">Tipo</label>
            <select
              name="icon"
              v-model="expense.icon"
              id="icon"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un tipo --</option>
              <option
                v-for="(icon, index) in icons"
                :key="index"
                :value="icon.icon"
              >
                {{ icon.title }}
              </option>
            </select>
          </div>
          <div class="py-2">
            <label for="month" class="font-semibold ml-3">Mes</label>
            <select
              name="month"
              v-model="entry.month"
              id="month"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un mes --</option>
              <option
                v-for="(month, index) in months"
                :key="index"
                :value="month.id"
              >
                {{ month.name }}
              </option>
            </select>
          </div>
          <div class="py-2">
            <label for="year" class="font-semibold ml-3">Año</label>
            <select
              name="year"
              v-model="entry.year"
              id="year"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un año --</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="py-2">
            <input
              type="checkbox"
              id="isActive"
              class="bg-green-trashteo m-2"
              v-model="expense.isActive"
            />
            <label for="isActive" class="">{{
              expense.isActive ? "Activo" : "Inactivo"
            }}</label>
          </div>
          <button class="w-full bg-yellow-600 text-white rounded my-1 p-2">
            Editar
          </button>
        </form>

        <pre class="container hidden">{{ $data }}</pre>
      </section>
    </main>

    <footer
      class="sticky bottom-0 w-full bg-yellow-400 border-t border-yellow-500 p-3 flex justify-between align-center"
    >
      <router-link
        v-for="(link, index) in footLinks"
        :key="index"
        :to="{
          name: link.component,
          params: { expense: $route.params.expense },
        }"
        class="w-1/3 text-gray-900 font-normal hover:text-white uppercase mx-auto p-0"
      >
        <div class="flex flex-col">
          <span class="text-3xl text-center py-1"
            ><i class="py-1" :class="link.icon ? link.icon : ''"></i
          ></span>
          <span class="text-xs text-center">{{ link.title }}</span>
        </div></router-link
      >
    </footer>
  </div>
</template>

<script>
// @ts-check
// @ts-ignore
import InternalNavbar from "@/components/AtomicDesign/Organisms/InternalNavbar.vue";
// @ts-ignore
import ExpenseDataService from "@/graphql/ExpenseDataService.js";
// @ts-ignore
import ItemDataService from "@/graphql/ItemDataService.js";
// @ts-ignore
import MonthDataService from "@/graphql/MonthDataService.js";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      expense: {
        name: "",
        amount: "",
        item: "",
        month: "",
        year: "",
        isActive: "",
      },
      items: [],
      months: [],
      years: [],
      limit: 100,
      page: 1,
      icons: [
        {
          icon: "fas fa-lightbulb",
          title: "Energía",
        },
        {
          icon: "fas fa-burn",
          title: "Gas",
        },
        {
          icon: "fas fa-broadcast-tower",
          title: "Internet",
        },
        {
          icon: "fas fa-money-bill-wave",
          title: "Pago",
        },
        {
          icon: "fas fa-medkit",
          title: "Salud",
        },
        {
          icon: "fas fa-phone",
          title: "Teléfono",
        },
      ],
      footLinks: [
        {
          component: "Expense",
          icon: "fas fa-backward",
          title: "Volver",
          url: `/pagos/${this.$route.params.expense}`,
        },
      ],
      headerLinks: {
        icon: "fas fa-sitemap",
        title: "Editar Pago",
      },
    };
  },
  created() {
    this.getExpense();
    this.getItems();
    this.getMonths();
    this.getYears();
  },
  methods: {
    // @ts-ignore
    async updateExpense() {
      if (!this.expense.name) {
        return;
      }

      const expense = {
        name: this.expense.name,
        amount: this.expense.amount,
        item: this.expense.item,
        month: this.expense.month,
        year: this.expense.year,
        isActive: this.expense.isActive,
      };

      try {
        await ExpenseDataService.update(this.$route.params.expense, expense)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            await this.$router.push({
              name: "Expense",
              params: { expense: data.expenseUpdate.id },
            });
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    },
    // @ts-ignore
    async getExpense() {
      try {
        await ExpenseDataService.get(this.$route.params.expense)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            this.expense = data.expense;
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    },
    // @ts-ignore
    async getItems() {
      try {
        await ItemDataService.list(this.limit, this.page)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            this.items = data.items;
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    },
    // @ts-ignore
    async getMonths() {
      try {
        await MonthDataService.list(this.limit, this.page)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            this.months = data.months;
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    },
    // @ts-ignore
    async getYears() {
      const currentYear = new Date().getFullYear() - 2;

      let year = [];
      for (let i = currentYear; i <= currentYear + 9; i++) {
        year.push(i);
      }

      this.years = year;
    },
  },
  watch: {
    $route: ["getExpense", "getItems", "getMonths", "getYears"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
