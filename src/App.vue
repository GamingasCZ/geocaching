<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './komponenty/Navbar.vue';
import { notificatons } from './komponenty/ostatni/summonNotif';
import Notifikace from './komponenty/ostatni/notifikace.vue';
</script>

<template>
  <Navbar />
  <RouterView class="grow" />
  <div id="NotificationStack" class="flex fixed z-50 flex-col gap-4 justify-end items-end p-8 w-screen h-screen pointer-events-none">
    <Notifikace v-for="notif in notificatons" :text="notif" />
  </div>
</template>
