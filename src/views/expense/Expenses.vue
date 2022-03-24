<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <section class="">
        <router-link
          v-for="(expense, index) in expenses"
          :key="index"
          :to="{ name: 'Expense', params: { expense: expense.id } }"
        >
          <div class="w-full bg-white rounded my-1 p-3">
            <span class="text-l">{{ expense.name }}</span> <br />
            <span class="text-xl font-bold">COP ${{ expense.amount }}</span>
          </div>
        </router-link>
        <div v-if="count === 0" class="w-full bg-white rounded my-1 p-3">
          No hay Gastos
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

export default {
  components: {
    TheNavbar,
  },
  data() {
    return {
      expenses: [],
      count: 0,
      footLinks: [
        {
          component: "NewExpense",
          icon: "fas fa-plus-circle",
          title: "Nuevo",
          url: "/presupuesto/nuevo",
        },
      ],
    };
  },
  created() {
    // this.getExpenses();
  },
  methods: {
    // @ts-ignore
    async getExpenses() {
      // const expenses = await DATA;
      // this.count = await DATA.length;
      // this.expenses = DATA.map((e) => Expense(e));
    },
  },
  watch: {
    // $route: ["getExpenses"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
