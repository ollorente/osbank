<template>
  <section class="">
    <div class="w-full bg-white rounded my-1 p-3">Detalle Presupuesto</div>
    <pre class="container">{{ $data }}</pre>
  </section>
</template>

<script>
import DB from "../../../../db.js";

const DATA = DB.DB.estimates;
const Estimate = DB.Estimate;

export default {
  data() {
    return {
      estimate: "",
    };
  },
  created() {
    this.getEstimate();
  },
  methods: {
    async getEstimate() {
      const estimate = await DATA.filter(e => e.id === this.$route.params.estimate);
console.log(estimate[0]);

      this.estimate = Estimate(estimate[0]);
    },
  },
  watch: {
    $route: ["getEstimate"],
  },
};
</script>

<style scoped></style>
