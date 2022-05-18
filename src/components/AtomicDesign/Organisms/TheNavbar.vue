<template>
  <header class="sticky top-0 bg-yellow-400 w-full text-center p-3">
    <router-link :to="{ name: 'Home' }" class="text-4xl font-bold"
      >OsBank</router-link
    >
    <button class="absolute text-4xl text-gray-900 hover:text-white top-3 right-3" @click="logout"><i class="far fa-times-circle"></i></button>

    <nav class="container mx-auto p-3 flex justify-between align-center">
      <router-link
        v-for="(link, index) in links"
        :key="index"
        :to="{ name: link.component }"
        class="w-1/4 text-white font-bold hover:text-gray-900 uppercase p-0"
        :class="$route.path === link.url ? 'text-gray-900' : ''"
      >
        <div class="flex flex-col">
          <span class="text-3xl text-center py-1"
            ><i class="py-1" :class="link.icon ? link.icon : ''"></i
          ></span>
          <span class="text-xs text-center">{{ link.title }}</span>
        </div></router-link
      >
    </nav>
  </header>
</template>

<script>
export default {
  name: "TheNavbar",
  data() {
    return {
      links: [
        {
          component: "Estimates",
          icon: "fas fa-wallet",
          title: "Presupuesto",
          url: "/presupuesto",
        },
        {
          component: "Expenses",
          icon: "fas fa-coins",
          title: "Pagos",
          url: "/pagos",
        },
        {
          component: "Entries",
          icon: "fas fa-funnel-dollar",
          title: "Ingresos",
          url: "/ingresos",
        },
        {
          component: "Items",
          icon: "fas fa-sitemap",
          title: "Ítems",
          url: "/items",
        },
      ],
    };
  },
  methods: {
    async logout() {
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");

      await this.$router.push("/login");
    },
  },
};
</script>

<style scoped></style>
