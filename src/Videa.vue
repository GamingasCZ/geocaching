<script setup lang="ts">
import Videa from './assety/videa';
import Nahled from './komponenty/videa/nahled.vue';
import Poznamky from './komponenty/videa/sidebar.vue'

</script>

<template>
    <main class="flex gap-4 justify-between px-4 mx-auto text">
        <section class="flex flex-wrap gap-4 mb-8 max-w-4xl overflow-x-clip nahledVidea">
            <Nahled v-for="video in Videa" :nazev="video.nazev" :url="video.url" />
        </section>
        <Poznamky class="ml-3 max-sm:hidden"/>
    </main>
</template>
