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
import UserDataService from "@/services/UserDataService.js";

export default {
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
    async addUser() {
      if (this.user.email === null) {
        alert("El correo electrónico no puede estar vacío!.");
        return;
      }

      if (this.user.phone === null) {
        alert("El teléfono no puede estar vacío!.");
        return;
      }

      if (this.user.password === null) {
        alert("El password no puede estar vacío!.");
        return;
      }

      if (this.user.password_confirmation !== this.user.password) {
        alert("El password no coincide!.");
        return;
      }

      const user = {
        email: this.user.email,
        name: this.user.name,
        password: this.user.password,
        phone: this.user.phone,
      };

      try {
        // @ts-ignore
        const { error } = await UserDataService.create(user)
          .then(async (response) => {
            return await response.data;
          })
          .catch((error) => console.log(error));
        if (error) {
          alert(error.message);
          return;
        }

        // @ts-ignore
        await this.$router.push("/login");
      } catch (err) {
        console.log(err);
        alert("Error al registrar el usuario!.");
        return;
      }
    },
  },
};
</script>

<style scoped></style>
