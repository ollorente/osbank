<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <section class="">
        <router-link
          v-for="(user, index) in users"
          :key="index"
          :to="{ name: 'User', params: { user: user.id } }"
        >
          <div class="w-full bg-white rounded my-1 p-3" :class="user.isActive ? 'opacity-100' : 'opacity-30'">
            <i
              class="w-8 text-2xl text-center mx-2"
              :class="user.icon ? user.icon : 'fas fa-suserap'"
            ></i>
            <img :src="user.image" :alt="user.name" class="w-8 h-8 rounded-full mx-2">
            <span class="text-l">{{ user.name }}</span> <br />
          </div>
        </router-link>
        <div v-if="count === 0" class="w-full bg-white rounded my-1 p-3">
          No hay Ítems
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
import UserDataService from "@/services/UserDataService";
// @ts-ignore
import TheNavbar from "@/components/AtomicDesign/Organisms/TheNavbar.vue";

export default {
  components: {
    TheNavbar,
  },
  data() {
    return {
      users: [],
      count: 0,
      limit: 20,
      page: 0,
      footLinks: [
        {
          component: "NewUser",
          icon: "fas fa-plus-circle",
          title: "Nuevo",
          url: "/usuarios/nuevo",
        },
      ],
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    // @ts-ignore
    async getUsers() {
      try {
        this.page++;

        const { data, status } = await UserDataService.list(
          this.limit,
          this.page
        )
          .then(async (response) => {
            console.log(response);
            return await response;
          })
          .catch((error) => console.log(error));

        if (status !== 200) {
          console.log(data);
        }

        this.users = data.data;
        this.count = data.total;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    $route: ["getUsers"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 15rem);
}
</style>
