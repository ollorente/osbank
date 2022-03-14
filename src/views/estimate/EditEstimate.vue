<script setup>
import { ref } from "vue";
import db from "../../../../db.js";

const DB = db.DB;
console.log(db.items);
</script>

<template>
	<div class="w-full bg-white rounded my-1 p-3">Editar Presupuesto</div>
</template>

<style scoped></style>
