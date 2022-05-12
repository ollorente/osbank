<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <form @submit.prevent="addEstimate">
          <div class="py-2">
            <label for="name" class="font-semibold ml-3">Nombre *</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="name"
              v-model="estimate.name"
              placeholder="Nombre *"
              autofocus
              required
            />
          </div>
          <div class="py-2">
            <label for="amount" class="font-semibold ml-3">Cantidad *</label>
            <input
              type="number"
              class="w-full bg-white rounded p-2"
              id="amount"
              v-model="estimate.amount"
              placeholder="Cantidad *"
              required
            />
          </div>
          <div class="py-2">
            <label for="item" class="font-semibold ml-3">Ítem</label>
            <select
              name="item"
              v-model="estimate.item"
              id="item"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un ítem --</option>
              <option
                v-for="(item, index) in items"
                :key="index"
                :value="item.id"
              >
                <i
                  class="w-8 text-2xl text-center mx-2"
                  :class="item.icon ? item.icon : 'fas fa-sitemap'"
                ></i>
                <span class="text-l">{{ item.name }}</span>
              </option>
            </select>
          </div>
          <div class="py-2">
            <label for="month" class="font-semibold ml-3">Mes</label>
            <select
              name="month"
              v-model="estimate.month"
              id="month"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un mes --</option>
              <option
                v-for="(month, index) in months"
                :key="index"
                :value="month.order"
              >
                {{ month.name }}
              </option>
            </select>
          </div>
          <div class="py-2">
            <label for="year" class="font-semibold ml-3">Año</label>
            <select
              name="year"
              v-model="estimate.year"
              id="year"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un año --</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <button
            type="submit"
            class="w-full bg-gray-900 text-white rounded my-1 p-2"
          >
            Agregar
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
        :to="{ name: link.component }"
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
import EstimateDataService from "@/graphql/EstimateDataService";
// @ts-ignore
import ItemDataService from "@/graphql/ItemDataService";
// @ts-ignore
import MonthDataService from "@/graphql/MonthDataService";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      estimate: {
        name: null,
        amount: null,
        item: null,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
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
          component: "Estimates",
          icon: "fas fa-backward",
          title: "Volver",
          url: "/presupuesto",
        },
      ],
      headerLinks: {
        icon: "fas fa-backward",
        title: "Nuevo presupuesto",
      },
    };
  },
  created() {
    this.getItems();
    this.getMonths()
    this.getYears()
  },
  methods: {
    // @ts-ignore
    async addEstimate() {
      if (!this.estimate.name || !this.estimate.amount || !this.estimate.item) {
        return;
      }

      const estimate = {
        name: this.estimate.name,
        amount: this.estimate.amount,
        item: this.estimate.item,
        month: String(this.estimate.month),
        year: this.estimate.year,
      };

      try {
        await EstimateDataService.create(estimate)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            await this.$router.push({
              name: "Estimate",
              params: { estimate: data.estimateCreate.id },
            });
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
    $route: ["getItems", "getMonths", "getYears"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
