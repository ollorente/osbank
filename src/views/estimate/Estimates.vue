<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <section class="">
        <router-link
          v-for="(estimate, index) in estimates"
          :key="index"
          :to="{ name: 'Estimate', params: { estimate: estimate.id } }"
        >
          <div class="w-full bg-white rounded my-1 p-3">
            <span class="text-l">{{ estimate.name }}</span> <br />
            <span class="text-xl font-bold">COP ${{ estimate.amount }}</span>
          </div>
        </router-link>
        <div v-if="count === 0" class="w-full bg-white rounded my-1 p-3">
          No hay Presupuesto
        </div>
        <pre class="container">{{ $data }}</pre>
      </section>
    </main>

    <footer class="sticky bottom-0 w-full bg-yellow-400 border-t border-yellow-500 p-3 flex justify-between align-center">
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
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

import DB from "../../../../db.js";

const DATA = DB.DB.estimates;
const Estimate = DB.Estimate;

export default {
  components: {
    TheNavbar,
  },
  data() {
    return {
      estimates: [],
      count: 0,
      footLinks: [
        {
          component: "NewEstimate",
          icon: "fas fa-plus-circle",
          title: "Nuevo",
          url: "/presupuesto/nuevo",
        },
      ],
    };
  },
  created() {
    this.getEstimates();
  },
  methods: {
    async getEstimates() {
      const estimates = await DATA;

      this.count = await DATA.length;
      this.estimates = DATA.map((e) => Estimate(e));
    },
  },
  watch: {
    $route: ["getEstimates"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
