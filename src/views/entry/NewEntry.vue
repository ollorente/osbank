<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <form @submit.prevent="addEntry">
          <div class="py-2">
            <label for="name" class="font-semibold ml-3">Nombre *</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="name"
              v-model="entry.name"
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
              v-model="entry.amount"
              placeholder="Cantidad *"
              required
            />
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
import EntryDataService from "@/graphql/EntryDataService";
// @ts-ignore
import MonthDataService from "@/graphql/MonthDataService";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      entry: {
        name: null,
        amount: null,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      months: [],
      years: [],
      limit: 100,
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
    async addEntry() {
      if (!this.entry.name || !this.entry.amount) {
        return;
      }

      const entry = {
        detail: this.entry.name,
        amount: this.entry.amount,
        month: String(this.entry.month),
        year: this.entry.year,
      };

      try {
        await EntryDataService.create(entry)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            await this.$router.push({
              name: "Entry",
              params: { entry: data.entryCreate.id },
            });
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
    $route: ["getMonths", "getYears"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
