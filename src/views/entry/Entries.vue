<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <section class="">
        <router-link
          v-for="(entry, index) in entries"
          :key="index"
          :to="{ name: 'Entry', params: { entry: entry.id } }"
        >
          <div
            class="w-full bg-white rounded my-1 p-3 flex justify-between align-start"
            :class="entry.isActive ? 'opacity-100' : 'opacity-30'"
          >
            <div
              class="w-full bg-white rounded px-3"
              :class="entry.isActive ? 'opacity-100' : 'opacity-30'"
            >
              <div class="flex flex-col text-left">
                <span class="text-l text-gray-400 font-semibold"
                  >{{ entry.month.name }} {{ entry.year }}</span
                >
                <span  class="text-xl font-bold">COP ${{ entry.amount }}</span>
              </div>
              <div class="text-l">
                <span class="">{{ entry.detail }}</span>
              </div>
            </div>
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
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";
// @ts-ignore
import EntryDataService from "@/graphql/EntryDataService.js";

export default {
  components: {
    TheNavbar,
  },
  data() {
    return {
      entries: [],
      count: 0,
      limit: 20,
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

        await EntryDataService.list(this.limit, this.page)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            this.entries = data.entries;
            this.count = data.entries.length;
          })
          .catch((error) => console.log(error));
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
