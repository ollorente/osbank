<template>
  <div class="relative w-full min-h-screen bg-yellow-400 font-sans">
    <InternalNavbar :link="headerLinks" />

    <main class="container mx-auto p-3">
      <section class="">
        <form @submit.prevent="updateItem">
          <div class="py-2">
            <label for="name" class="font-semibold ml-3">Nombre *</label>
            <input
              type="text"
              class="w-full bg-white rounded p-2"
              id="name"
              v-model="item.name"
              placeholder="Nombre *"
              autofocus
              required
            />
          </div>
          <div class="py-2">
            <label for="icon" class="font-semibold ml-3">Tipo</label>
            <select
              name="icon"
              v-model="item.icon"
              id="icon"
              class="w-full bg-white rounded p-2"
            >
              <option value="null" selected>-- Seleccione un tipo --</option>
              <option
                v-for="(icon, index) in icons"
                :key="index"
                :value="icon.icon"
              >
                {{ icon.title }}
              </option>
            </select>
          </div>
          <div class="py-2">
            <input
              type="checkbox"
              id="isActive"
              class="bg-green-trashteo m-2"
              v-model="item.isActive"
            />
            <label for="isActive" class="">{{
              item.isActive ? "Activo" : "Inactivo"
            }}</label>
          </div>
          <button class="w-full bg-yellow-600 text-white rounded my-1 p-2">
            Editar
          </button>
        </form>

        <pre class="container hidden">{{ $data }}</pre>
      </section>
    </main>

    <footer
      class="sticky bottom-0 w-full bg-yellow-400 border-t border-yellow-500 p-3 flex justify-between align-center"
    >
      <router-link
        v-for="(link, index) in footLinks"
        :key="index"
        :to="{ name: link.component, params: { item: $route.params.item } }"
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
import InternalNavbar from "@/components/AtomicDesign/Organisms/InternalNavbar.vue";
// @ts-ignore
import ItemDataService from "@/graphql/ItemDataService.js";

export default {
  components: {
    InternalNavbar,
  },
  data() {
    return {
      item: {
        name: "",
        icon: "",
        isActive: "",
      },
      icons: [
        {
          icon: "fas fa-lightbulb",
          title: "Energía",
        },
        {
          icon: "fas fa-burn",
          title: "Gas",
        },
        {
          icon: "fas fa-broadcast-tower",
          title: "Internet",
        },
        {
          icon: "fas fa-money-bill-wave",
          title: "Pago",
        },
        {
          icon: "fas fa-medkit",
          title: "Salud",
        },
        {
          icon: "fas fa-phone",
          title: "Teléfono",
        },
      ],
      footLinks: [
        {
          component: "Item",
          icon: "fas fa-backward",
          title: "Volver",
          url: `/items/${this.$route.params.item}`,
        },
      ],
      headerLinks: {
        icon: "fas fa-sitemap",
        title: "Editar Ítem",
      },
    };
  },
  created() {
    this.getItem();
  },
  methods: {
    // @ts-ignore
    async getItem() {
      try {
        await ItemDataService.get(this.$route.params.item)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            this.item = data.item;
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    },
    // @ts-ignore
    async updateItem() {
      if (!this.item.name) {
        return;
      }

      const item = {
        name: this.item.name,
        icon: this.item.icon,
        isActive: this.item.isActive,
      };

      try {
        await ItemDataService.update(this.$route.params.item, item)
          .then((r) => r.json())
          .then(async (response) => {
            const { data, errors } = await response;

            if (errors) {
              console.log(errors[0].message);
              return;
            }

            await this.$router.push({
              name: "Item",
              params: { item: data.itemUpdate.id },
            });
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    $route: ["getItem"],
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 12.8rem);
}
</style>
