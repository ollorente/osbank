<template>
  <section class="">
    <div class="w-full bg-white rounded my-1 p-3">Detalle Ingreso</div>
    <pre class="container">{{ $data }}</pre>
  </section>
</template>

<script>
// @ts-check

export default {
  data() {
    return {
      entry: "",
    };
  },
  created() {
    this.getEntry();
  },
  methods: {
    // @ts-ignore
    async getEntry() {
      // const entry = await DATA.filter(e => e.id === this.$route.params.entry);
// console.log(entry[0]);

      // this.entry = Entry(entry[0]);
    },
  },
  watch: {
    $route: ["getEntry"],
  },
};
</script>

<style scoped></style>
