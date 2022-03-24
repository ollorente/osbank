<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <div
        class="w-72 h-72 bg-white text-gray-900 text-center rounded-full mx-auto p-3 flex"
      >
        <div class="m-auto">
          <div class="font-bold"><span class="text-2xl">COP</span><br /><span class="text-4xl">${{ user.total }}</span></div>
          <div class="text-xl">Saldo</div>
        </div>
      </div>

      <div class="flex justify-between align-center">
        <div
          class="w-36 h-36 bg-white text-gray-900 text-center rounded-full mx-auto p-3 flex"
        >
          <div class="m-auto">
            <div class="font-bold"><span class="text-xl">COP</span><br /><span class="text-2xl">${{ user.estimate }}</span></div>
            <div class="text-xl">Presupuesto</div>
          </div>
        </div>

        <div
          class="w-36 h-36 bg-white text-gray-900 text-center rounded-full mx-auto p-3 flex"
        >
          <div class="m-auto">
            <div class="font-bold"><span class="text-xl">COP</span><br /><span class="text-2xl">${{ user.expense }}</span></div>
            <div class="text-xl">Gastos</div>
          </div>
        </div>
      </div>

      <pre class="container hidden">{{ $data }}</pre>
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
import UserDataService from "@/services/UserDataService";
// @ts-ignore
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

export default {
  components: {
    TheNavbar,
  },
  data() {
    return {
      user: {},
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
          component: "User",
          icon: "fas fa-plus-circle",
          title: "Perfil",
          url: "/usuario",
        },
      ],
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    // @ts-ignore
    async getUser() {
      try {
        const { data, error } = await UserDataService.get()
          .then(async (response) => {
            return await response.data;
          })
          .catch((error) => console.log(error));

        if (error) {
          console.log(error.message);
        }

        this.user = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    $route: ["getUser"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
