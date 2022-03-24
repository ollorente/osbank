<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <div
        class="w-72 h-72 bg-white text-gray-900 text-center rounded-full mx-auto p-3 flex"
      >
        <div class="m-auto">
          <div class="text-4xl font-bold">COP ${{ total.total }}</div>
          <div class="text-xl">Saldo</div>
        </div>
      </div>

      <div
        class="w-36 h-36 bg-white text-gray-900 text-center rounded-full mx-auto p-3 flex"
      >
        <div class="m-auto">
          <div class="text-2xl font-bold">COP ${{ total.estimate }}</div>
          <div class="text-xl">Presupuesto</div>
        </div>
      </div>

      <div
        class="w-36 h-36 bg-white text-gray-900 text-center rounded-full mx-auto p-3 flex"
      >
        <div class="m-auto">
          <div class="text-2xl font-bold">COP ${{ total.expense }}</div>
          <div class="text-xl">Saldo</div>
        </div>
      </div>

      <pre class="container">{{ $Gastos }}</pre>
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
import TotalDataService from "@/services/TotalDataService";
// @ts-ignore
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

export default {
  name: "HomeTemplate",
  components: {
    TheNavbar,
  },
  data() {
    return {
      total: {},
      footLinks: [
        {
          component: "NewItem",
          icon: "fas fa-plus-circle",
          title: "Servicios",
          url: "/items/nuevo",
        },
        {
          component: "NewItem",
          icon: "fas fa-plus-circle",
          title: "Nuevo",
          url: "/items/nuevo",
        },
        {
          component: "NewItem",
          icon: "fas fa-plus-circle",
          title: "Perfil",
          url: "/items/nuevo",
        },
      ],
    };
  },
  created() {
    // this.getTotal();
  },
  methods: {
    // @ts-ignore
    async getTotal() {
      try {
        const { data, status } = await TotalDataService.get()
          .then(async (response) => {
            console.log(response);
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 200) {
          console.log(data);
        }

        this.total = data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    // $route: ["getTotal"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
