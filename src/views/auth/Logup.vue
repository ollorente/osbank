<template>
  <div class="w-full min-h-screen bg-yellow-400 font-sans">
    <main class="container mx-auto">
      <section class="flex min-h-screen p-3">
        <form @submit.prevent="addUser" class="m-auto">
          <p class="text-4xl font-bold text-center mb-4">OsBank</p>

          <h1 class="text-4xl text-center">Registro</h1>

          <div class="py-2">
            <label for="name" class="font-semibold ml-3">Nombre</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="name"
              v-model="user.name"
              placeholder="Nombre"
              autofocus
            />
          </div>
          <div class="py-2">
            <label for="email" class="font-semibold ml-3"
              >Correo electrónico *</label
            >
            <input
              type="email"
              class="w-full bg-white rounded p-2"
              id="email"
              v-model="user.email"
              placeholder="Correo electrónico *"
              required
            />
          </div>
          <div class="py-2">
            <label for="phone" class="font-semibold ml-3">Teléfono *</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="phone"
              v-model="user.phone"
              placeholder="Teléfono *"
              required
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
          <div class="py-2">
            <label for="password_confirmation" class="font-semibold ml-3"
              >Confirmar password *</label
            >
            <input
              type="password"
              class="w-full bg-white rounded p-2"
              id="password_confirmation"
              v-model="user.password_confirmation"
              placeholder="Confirmar password *"
              required
            />
          </div>
          <button class="w-full bg-gray-900 text-white rounded my-1 p-2">
            Registrarme
          </button>

          <div class="py-5 text-center">
            <router-link to="/login" class="text-gray-900 font-bold">
              [ Login ]
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
  name: "Logup",
  components: {},
  data() {
    return {
      user: {
        email: null,
        name: null,
        password: null,
        password_confirmation: null,
        phone: null,
      },
    };
  },
  methods: {
    // @ts-ignore
    async addUser() {
      if (
        !this.user.email ||
        !this.user.password ||
        !this.user.password_confirmation ||
        !this.user.phone
      ) {
        return;
      }

      try {
        const user = {
          email: this.user.email,
          name: this.user.name,
          password: this.user.password,
          phone: this.user.phone,
        };

        await UserDataService.create(user)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            await this.$router.push({ name: "Login" });
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
