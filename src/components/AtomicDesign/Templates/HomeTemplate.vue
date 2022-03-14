<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <div class="w-72 h-72 bg-white text-gray-900 text-center rounded-full mx-auto p-3 flex">
        <div class="m-auto">
          <div class="text-4xl font-bold">COP $4'578.000</div>
          <div class="text-xl">Saldo</div>
        </div>
      </div>
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
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

export default {
  name: "HomeTemplate",
  components: {
    TheNavbar,
  },
  data() {
    return {
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
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
