<template>
  <footer
    class="fixed bottom-0 w-full bg-white shadow-lg p-3 flex justify-between align-center"
  >
    <router-link
      v-for="(link, index) in links"
      :key="index"
      :to="{ name: link.component }"
      class="w-1/3 text-gray-800 font-normal hover:text-gray-900 uppercase mx-auto p-0"
    >
      <div class="flex flex-col">
        <span class="text-3xl text-center py-1"
          ><i class="py-1" :class="link.icon ? link.icon : ''"></i
        ></span>
        <span class="text-xs text-center">{{ link.title }}</span>
      </div>
    </router-link>
  </footer>
</template>

<script>
export default {
  name: "TheFooter",
  props: ["links"],
};
</script>

<style scoped></style>
