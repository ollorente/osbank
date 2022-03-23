<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <section class="">
        <router-link
          v-for="(entry, index) in entries"
          :key="index"
          :to="{ name: 'Entry', params: { entry: entry.id } }"
        >
          <div class="w-full bg-white rounded my-1 p-3">
            <div class="flex justify-between align-center">
              <span class="text-l">{{ entry.month.name }}</span>
              <span class="text-l">{{ entry.year }}</span>
            </div>
            <div>
              <span class="text-xl font-bold">COP ${{ entry.amount }}</span>
            </div>
          </div>
        </router-link>
        <div v-if="count === 0" class="w-full bg-white rounded my-1 p-3">
          No hay Ingresos
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
import EntryDataService from "@/services/EntryDataService.js";
// @ts-ignore
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

export default {
  components: {
    TheNavbar,
  },
  data() {
    return {
      entries: [],
      count: 0,
      limit: 10,
      page: 0,
      footLinks: [
        {
          component: "NewEntry",
          icon: "fas fa-plus-circle",
          title: "Nuevo",
          url: "/ingresos/nuevo",
        },
      ],
    };
  },
  created() {
    this.getEntries();
  },
  methods: {
    // @ts-ignore
    async getEntries() {
      try {
        this.page++;

        const { data, status } = await EntryDataService.list(
          this.limit,
          this.page
        )
          .then(async (response) => {
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 200) {
          console.log(data);
        }

        this.entries = data;
        this.count = data.length;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    $route: ["getEntries"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
