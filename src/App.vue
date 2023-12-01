<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './komponenty/Navbar.vue';
</script>

<template>
  <Navbar />
  <RouterView class="grow" />
</template>
