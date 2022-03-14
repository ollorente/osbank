<template>
  <section class="">
    <div class="w-full bg-white rounded my-1 p-3">Detalle Gasto</div>
    <pre class="container">{{ $data }}</pre>
  </section>
</template>

<script>
import DB from "../../../../db.js";

const DATA = DB.DB.expenses;
const Expense = DB.Expense;

export default {
  data() {
    return {
      expense: "",
    };
  },
  created() {
    this.getExpense();
  },
  methods: {
    async getExpense() {
      const expense = await DATA.filter(e => e.id === this.$route.params.expense);
console.log(expense[0]);

      this.expense = Expense(expense[0]);
    },
  },
  watch: {
    $route: ["getExpense"],
  },
};
</script>

<style scoped></style>
