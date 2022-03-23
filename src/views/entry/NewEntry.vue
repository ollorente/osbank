<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <form @submit.prevent="addEntry">
          <div class="py-2">
            <label for="amount" class="font-semibold ml-3">Monto *</label>
            <input
              type="number"
              class="w-full bg-white rounded p-2"
              id="amount"
              min="0"
              v-model="entry.amount"
              placeholder="Monto *"
              autofocus
              required
            />
          </div>
          <div class="py-2">
            <label for="detail" class="font-semibold ml-3">Detalle</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="detail"
              v-model="entry.detail"
              placeholder="Detalle"
            />
          </div>
          <div class="py-2">
            <label for="monthId" class="font-semibold ml-3">Mes</label>
            <select
              name="monthId"
              v-model="entry.monthId"
              id="monthId"
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
          <button class="w-full bg-gray-900 text-white rounded my-1 p-2">
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
import EntryDataService from "@/services/EntryDataService";
// @ts-ignore
import MonthDataService from "@/services/MonthDataService";
// @ts-ignore
import EntryInterface from "@/interfaces/EntryInterface.js";
// @ts-ignore
import InternalNavbar from "@/components/AtomicDesign/Organisms/InternalNavbar.vue";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      entry: {
        amount: null,
        detail: null,
        monthId: null,
        year: new Date().getFullYear(),
      },
      months: [],
      years: [],
      limit: 20,
      page: 1,
      footLinks: [
        {
          component: "Entries",
          icon: "fas fa-backward",
          title: "Volver",
          url: "/ingresos",
        },
      ],
      headerLinks: {
        icon: "fas fa-backward",
        title: "Nuevo ingreso",
      },
    };
  },
  created() {
    this.getMonths();
    this.getYears();
  },
  methods: {
    // @ts-ignore
    async getMonths() {
      try {
        const { data } = await MonthDataService.list(this.limit, this.page)
          .then(async (response) => {
            return await response;
          })
          .catch((error) => console.log(error));

        this.months = await data;
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
    // @ts-ignore
    async addEntry() {
      try {
        if (this.entry.amount === null) {
          alert("Monto no puede estar vacio.");
          return;
        }

        const entry = await EntryInterface(this.entry);

        const { data, status } = await EntryDataService.create(entry)
          .then(async (response) => {
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 201) {
          console.log(data);
        }

        await this.$router.push({ name: "Entries" });
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    $route: ["getMonths", "getYears"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
