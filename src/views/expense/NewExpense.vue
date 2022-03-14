<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <form @submit.prevent="addExpense">
          <div class="py-2">
            <label for="name" class="font-semibold ml-3">Nombre *</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="name"
              v-model="expense.name"
              placeholder="Nombre *"
              autofocus
              required
            />
          </div>
          <div class="py-2">
            <label for="icon" class="font-semibold ml-3">Tipo</label>
            <select
              name="icon"
              v-model="expense.icon"
              id="icon"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un tipo --</option>
              <option
                v-for="(icon, index) in icons"
                :key="index"
                :value="icon.icon"
              >
                {{ icon.title }}
              </option>
            </select>
          </div>
          <button class="w-full bg-gray-900 text-white rounded my-1 p-2">
            Agregar
          </button>
        </form>

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
import ExpenseDataService from "@/services/ExpenseDataService";
// @ts-ignore
import ExpenseInterface from "@/interfaces/ExpenseInterface.js";
// @ts-ignore
import InternalNavbar from "@/components/AtomicDesign/Organisms/InternalNavbar.vue";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      expense: {
        name: null,
        icon: null,
      },
      icons: [
        {
          icon: "fas fa-lightbulb",
          title: "Energía",
        },
        {
          icon: "fas fa-burn",
          title: "Gas",
        },
        {
          icon: "fas fa-broadcast-tower",
          title: "Internet",
        },
        {
          icon: "fas fa-money-bill-wave",
          title: "Pago",
        },
        {
          icon: "fas fa-medkit",
          title: "Salud",
        },
        {
          icon: "fas fa-phone",
          title: "Teléfono",
        },
      ],
      footLinks: [
        {
          component: "Expenses",
          icon: "fas fa-backward",
          title: "Volver",
          url: "/gastos",
        },
      ],
      headerLinks: {
        icon: "fas fa-backward",
        title: "Nuevo Gasto",
      },
    };
  },
  methods: {
    // @ts-ignore
    async addExpense() {
      try {
        if (this.expense.name === null) {
          alert("Nombre no puede estar vacio.");
          return;
        }

        const expense = await ExpenseInterface(this.expense);

        const { data, status } = await ExpenseDataService.create(expense)
          .then(async (response) => {
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 201) {
          console.log(data);
        }

        await this.$router.push({ name: "Expenses" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
