<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <main class="container mx-auto">
      <section class="flex min-h-screen p-3">
        <form @submit.prevent="authUser" class="m-auto">
          <p class="text-4xl font-bold text-center mb-4">OsBank</p>

          <h1 class="text-4xl text-center">Login</h1>

          <div class="py-2">
            <label for="username" class="font-semibold ml-3"
              >Correo electrónico o teléfono *</label
            >
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="username"
              v-model="user.username"
              placeholder="Correo electrónico o teléfono *"
              autofocus
            />
          </div>
          <div class="py-2">
            <label for="password" class="font-semibold ml-3">Password *</label>
            <input
              type="password"
              class="w-full bg-white rounded p-2"
              id="password"
              v-model="user.password"
              placeholder="Password *"
              required
            />
          </div>
          <button class="w-full bg-gray-900 text-white rounded my-1 p-2">
            Entrar
          </button>

          <div class="py-5 text-center">
            <router-link to="/registro" class="text-gray-900 font-bold">
              [ Registro ]
            </router-link>
          </div>
        </form>
      </section>
      <pre class="container hidden">{{ $data }}</pre>
    </main>
  </div>
</template>

<script>
// @ts-check
// @ts-ignore
import UserDataService from "@/graphql/UserDataService.js";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      user: {
        username: null,
        password: null,
      },
    };
  },
  methods: {
    // @ts-ignore
    async authUser() {
      if (!this.user.username || !this.user.password) {
        return;
      }

      try {
        await UserDataService.auth(this.user)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            await localStorage.setItem("token", data.auth.token);
            await sessionStorage.setItem(
              "user",
              JSON.stringify(data.auth.user)
            );

            await this.$router.push({ name: "Home" });
          })
          .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped></style>
