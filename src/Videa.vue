<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import Videa from './assety/videa';
import Nahled from './komponenty/videa/nahled.vue';

</script>

<template>
    <main class="flex gap-4 justify-between px-4 pb-10 mx-auto">
        <section class="flex flex-wrap gap-4 mb-16 max-w-4xl overflow-x-clip nahledVidea max-h-[30rem]">
            <Nahled :nazev="Videa[0].nazev" :url="Videa[0].url" />
            <Nahled v-for="video in Videa.slice(1)" :nazev="video.nazev" :url="video.url" />
        </section>
    </main>
</template>
