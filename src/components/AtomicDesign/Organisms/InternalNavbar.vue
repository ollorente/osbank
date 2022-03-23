<template>
  <header class="sticky top-0 bg-yellow-400 w-full text-center p-3">
    <router-link :to="{ name: 'Home' }" class="text-4xl font-bold"
      >OsBank</router-link
    >

    <nav class="container mx-auto p-3 text-center">
      <span class="text-xl font-semibold uppercase">{{ link.title }}</span>
    </nav>
  </header>
</template>

<script>
export default {
  name: "InternalNavbar",
  props: ["link"],
};
</script>

<style scoped></style>
