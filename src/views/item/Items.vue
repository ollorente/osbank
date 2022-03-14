<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <section class="">
        <router-link
          v-for="(item, index) in items"
          :key="index"
          :to="{ name: 'Item', params: { item: item.id } }"
        >
          <div class="w-full bg-white rounded my-1 p-3" :class="item.isActive ? 'opacity-100' : 'opacity-30'">
            <i
              class="w-8 text-2xl text-center mx-2"
              :class="item.icon ? item.icon : 'fas fa-sitemap'"
            ></i>
            <span class="text-l">{{ item.name }}</span> <br />
          </div>
        </router-link>
        <div v-if="count === 0" class="w-full bg-white rounded my-1 p-3">
          No hay Ítems
        </div>
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
import ItemDataService from "@/services/ItemDataService";
// @ts-ignore
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

export default {
  components: {
    TheNavbar,
  },
  data() {
    return {
      items: [],
      count: 0,
      limit: 20,
      page: 0,
      footLinks: [
        {
          component: "NewItem",
          icon: "fas fa-plus-circle",
          title: "Nuevo",
          url: "/items/nuevo",
        },
      ],
    };
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      try {
        this.page++;

        const { data, status } = await ItemDataService.list(
          this.limit,
          this.page
        )
          .then(async (response) => {
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 200) {
          console.log(error);
        }

        this.items = data;
        this.count = data.length;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    $route: ["getItems"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
