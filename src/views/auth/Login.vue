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
import { mapActions } from "vuex";
// @ts-ignore
import UserDataService from "@/services/UserDataService.js";

export default {
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
    ...mapActions(["auth"]),
    async authUser() {
      // @ts-ignore
      if (this.user.username === null) {
        alert("El correo electrónico o teléfono no puede estar vacío!.");
        return;
      }

      // @ts-ignore
      if (this.user.password === null) {
        alert("El password no puede estar vacío!.");
        return;
      }

      const data = {
        // @ts-ignore
        username: this.user.username,
        // @ts-ignore
        password: this.user.password,
      };

      try {
        // @ts-ignore
        const { error, token, user } = await UserDataService.auth(data)
          .then(async (response) => {
            return await response.data;
          })
          .catch((error) => console.log(error));

        if (error) {
          alert(error.message);
          return;
        }

        // localStorage.setItem("token", token);
        console.log(token);
        await this.auth(token);
        sessionStorage.setItem("user", JSON.stringify(user));

        // @ts-ignore
        // await this.$store.state.currentUser;
        // @ts-ignore
        // await this.$store.state.currentToken;

        // @ts-ignore
        await this.$router.push("/");
      } catch (err) {
        console.log(err);
        alert("Error al certificar al usuario!.");
        return;
      }
    },
  },
  computed: {},
};
</script>

<style scoped></style>
