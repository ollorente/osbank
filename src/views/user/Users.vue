<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <TheNavbar />

    <main class="container mx-auto p-3">
      <section class="">
        <ol v-for="(user, index) in users" :key="index">
          <router-link :to="{ name: 'User', params: { user: user.id } }">
            <div
              class="w-full bg-white rounded my-1 p-3 flex"
              :class="user.isActive ? 'opacity-100' : 'opacity-30'"
            >
              <div class="text-l font-bold mr-3">{{ ++index }}.</div>
              <div>
                <span class="text-l font-bold">{{ user.name }}</span> <br />
                <span class="text-l">{{ user.createdAt.split("T")[0] }}</span>
              </div>
            </div>
          </router-link>
        </ol>
        <div v-if="count === 0" class="w-full bg-white rounded my-1 p-3">
          No hay Usuarios
        </div>
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
import UserDataService from "@/services/UserDataService.js";
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

        const { error, count, data } = await UserDataService.list(
          this.limit,
          this.page
        )
          .then(async (response) => {
            return await response.data;
          })
          .catch((error) => console.log(error));

        if (error) {
          console.log(error.message);
        }

        this.users = data;
        this.count = count;
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
