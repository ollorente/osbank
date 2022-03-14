<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

export default {
  name: "HomeTemplate",
  components: {
    TheNavbar,
  },
};
</script>

<style scoped></style>
