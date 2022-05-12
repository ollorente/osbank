<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <div class="w-full bg-white rounded mb-3 p-3">
          <p class="flex flex-col py-3">
            <span class="font-bold">Nombre</span>
            <span>{{ estimate.name }}</span>
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Ícono</span>
            <span
              ><i
                class="text-3xl"
                :class="estimate.icon ? estimate.icon : 'fas fa-sestimateap'"
              ></i
            ></span>
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Activo</span>
            <span
              ><i
                class="mr-2"
                :class="estimate.isActive ? 'fas fa-circle' : 'far fa-circle'"
              ></i
              >{{ estimate.isActive ? "Activo" : "Inactivo" }}</span
            >
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Creado</span>
            <span>{{ estimate?.createdAt?._.split('T')[0] }}</span>
          </p>
          <p
            class="flex flex-col py-3"
            v-if="estimate?.createdAt?._ !== estimate?.updatedAt?._"
          >
            <span class="font-bold">Modificado</span>
            <span>{{ estimate?.updatedAt?._.split('T')[0] }}</span>
          </p>
        </div>

        <router-link
          :to="{ name: 'EditEstimate', params: { estimate: $route.params.estimate } }"
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
import InternalNavbar from "@/components/AtomicDesign/Organisms/InternalNavbar.vue";
// @ts-ignore
import EstimateDataService from "@/graphql/EstimateDataService.js";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      estimate: "",
      footLinks: [
        {
          component: "Estimates",
          icon: "fas fa-backward",
          title: "Volver",
          url: "/presupuesto",
        },
      ],
      headerLinks: {
        icon: "fas fa-sitemap",
        title: "Presupuesto",
      },
    };
  },
  created() {
    this.getEstimate();
  },
  methods: {
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
    async remove() {
      if (window.confirm(`Está a punto de borrar un elemento`)) {
        try {
          await EstimateDataService.remove(this.$route.params.estimate)
            .then((r) => r.json())
            .then(async (response) => {
              const { data, errors } = await response;

              if (errors) {
                console.log(errors[0].message);
                return;
              }

              await this.$router.push({ name: "Estimates" });
            })
            .catch((error) => console.log(error));
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  watch: {
    $route: ["getEstimate"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
