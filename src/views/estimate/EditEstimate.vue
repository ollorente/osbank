<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <form @submit.prevent="updateEstimate">
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
            <label for="icon" class="font-semibold ml-3">Tipo</label>
            <select
              name="icon"
              v-model="estimate.icon"
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
          <div class="py-2">
            <input
              type="checkbox"
              id="isActive"
              class="bg-green-trashteo m-2"
              v-model="estimate.isActive"
            />
            <label for="isActive" class="">{{
              estimate.isActive ? "Activo" : "Inactivo"
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
        :to="{ name: link.component, params: { estimate: $route.params.estimate } }"
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
import EstimateDataService from "@/graphql/EstimateDataService.js";
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
      estimate: {
        name: "",
        icon: "",
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
          component: "Estimate",
          icon: "fas fa-backward",
          title: "Volver",
          url: `/estimates/${this.$route.params.estimate}`,
        },
      ],
      headerLinks: {
        icon: "fas fa-sestimateap",
        title: "Editar Ítem",
      },
    };
  },
  created() {
    this.getEstimate();
    this.getItems();
    this.getMonths();
    this.getYears();
  },
  methods: {
    // @ts-ignore
    async updateEstimate() {
      if (!this.estimate.name) {
        return;
      }

      const estimate = {
        name: this.estimate.name,
        icon: this.estimate.icon,
        isActive: this.estimate.isActive,
      };

      try {
        await EstimateDataService.update(this.$route.params.estimate, estimate)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            await this.$router.push({
              name: "Estimate",
              params: { estimate: data.estimateUpdate.id },
            });
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    },
    // @ts-ignore
    async getEstimate() {
      try {
        await EstimateDataService.get(this.$route.params.estimate)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            this.estimate = data.estimate;
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
    $route: ["getEstimate", "getItems", "getMonths", "getYears"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
