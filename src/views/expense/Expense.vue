<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <div class="w-full bg-white rounded mb-3 p-3">
          <p class="flex flex-col py-3">
            <span class="font-bold">Nombre</span>
            <span>{{ expense.name }}</span>
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Ícono</span>
            <span
              ><i
                class="text-3xl"
                :class="expense.icon ? expense.icon : 'fas fa-sexpenseap'"
              ></i
            ></span>
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Activo</span>
            <span
              ><i
                class="mr-2"
                :class="expense.isActive ? 'fas fa-circle' : 'far fa-circle'"
              ></i
              >{{ expense.isActive ? "Activo" : "Inactivo" }}</span
            >
          </p>
          <p class="flex flex-col py-3">
            <span class="font-bold">Creado</span>
            <span>{{ expense?.createdAt?._.split('T')[0] }}</span>
          </p>
          <p
            class="flex flex-col py-3"
            v-if="expense?.createdAt?._ !== expense?.updatedAt?._"
          >
            <span class="font-bold">Modificado</span>
            <span>{{ expense?.updatedAt?._.split('T')[0] }}</span>
          </p>
        </div>

        <router-link
          :to="{ name: 'EditExpense', params: { expense: $route.params.expense } }"
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
import ExpenseDataService from "@/graphql/ExpenseDataService.js";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      expense: "",
      footLinks: [
        {
          component: "Expenses",
          icon: "fas fa-backward",
          title: "Volver",
          url: "/pagos",
        },
      ],
      headerLinks: {
        icon: "fas fa-sitemap",
        title: "Pagos",
      },
    };
  },
  created() {
    this.getExpense();
  },
  methods: {
    // @ts-ignore
    async getExpense() {
      try {
        await ExpenseDataService.get(this.$route.params.expense)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            this.expense = data.expense;
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
          await ExpenseDataService.remove(this.$route.params.expense)
            .then((r) => r.json())
            .then(async (response) => {
              const { data, errors } = await response;

              if (errors) {
                console.log(errors[0].message);
                return;
              }

              await this.$router.push({ name: "Expenses" });
            })
            .catch((error) => console.log(error));
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  watch: {
    $route: ["getExpense"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
