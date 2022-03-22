<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <div class="w-full bg-white rounded mb-3 p-3">
          <p class="flex flex-col py-3">
            <span class="font-bold">Monto</span>
            <span class="text-4xl">${{ entry.amount }}</span>
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Detalle</span>
            <span>{{ entry.detail }}</span>
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Mes</span>
            <span class="flex justify-between align-center"
              >{{ entry.month.name }} {{ entry.year }}</span
            >
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Activo</span>
            <span
              ><i
                class="mr-2"
                :class="entry.isActive ? 'fas fa-circle' : 'far fa-circle'"
              ></i
              >{{ entry.isActive ? "Activo" : "Inactivo" }}</span
            >
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Creado</span>
            <span>{{ new Date(entry.createdAt).toDateString() }}</span>
          </p>
          <p
            class="flex flex-col py-3"
            v-if="entry.createdAt !== entry.updatedAt"
          >
            <span class="font-bold">Modificado</span>
            <span>{{ new Date(entry.updatedAt).toDateString() }}</span>
          </p>
        </div>

        <router-link
          :to="{ name: 'EditEntry', params: { entry: $route.params.entry } }"
          class="w-full text-gray-900 mb-3"
        >
          <div
            class="w-full text-center uppercase border-2 border-gray-900 rounded mb-3 p-2"
          >
            Editar
          </div>
        </router-link>

        <button
          class="w-full text-white uppercase border-2 border-white rounded p-2"
          @click="remove"
        >
          Eliminar
        </button>

        <pre class="container hidden">{{ $data }}</pre>
      </section>
    </main>

    <footer
      class="sticky bottom-0 w-full bg-yellow-400 border-t-2 border-yellow-500 p-3 flex justify-between align-center"
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
import InternalNavbar from "@/components/AtomicDesign/Organisms/InternalNavbar.vue";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      entry: {
        id: "",
        amount: 0,
        detail: "",
        month: {
          name: "",
          start: 1,
          end: 30,
        },
        year: new Date().getFullYear(),
        userId: "",
        isActive: false,
        createdAt: "",
        updatedAt: "",
      },
      footLinks: [
        {
          component: "Entries",
          icon: "fas fa-backward",
          title: "Volver",
          url: "/ingresos",
        },
      ],
      headerLinks: {
        icon: "fas fa-sitemap",
        title: "Ingreso",
      },
    };
  },
  created() {
    this.getEntry();
  },
  methods: {
    // @ts-ignore
    async getEntry() {
      try {
        const { data, status } = await EntryDataService.get(
          this.$route.params.entry
        )
          .then(async (response) => {
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 200) {
          console.log(data);
        }

        this.entry = {
          id: await data.id,
          amount: await data.amount,
          detail: await data.detail,
          month: {
            name: await data.month.name,
            start: await data.month.start,
            end: await data.month.end,
          },
          year: await data.year,
          userId: await data.userId,
          isActive: await data.isActive,
          createdAt: await data.createdAt,
          updatedAt: await data.updatedAt,
        };
        this.headerLinks.title = await data.detail;
      } catch (error) {
        console.log(error);
      }
    },
    // @ts-ignore
    async remove() {
      if (window.confirm(`Está a punto de borrar un elemento`)) {
        const { status } = await EntryDataService.remove(
          this.$route.params.entry
        )
          .then(async (response) => {
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 200) {
          return;
        }

        await this.$router.push({ name: "Entries" });
      }
    },
  },
  watch: {
    $route: ["getEntry"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
