<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import Videa from './assety/videa';
import Nahled from './komponenty/videa/nahled.vue';
import Poznamky from './komponenty/videa/sidebar.vue'

const smallScreen = ref(window.innerWidth < 640)
window.onresize = (e) => {
    smallScreen.value = window.innerWidth < 640
}
onUnmounted(() => {
    window.onresize = null
})

</script>

<template>
    <main class="flex gap-4 justify-between px-4 mx-auto text">
        <section class="flex flex-wrap gap-4 mb-16 max-w-4xl overflow-x-clip nahledVidea max-h-[30rem]">
            <Nahled :nazev="Videa[0].nazev" :url="Videa[0].url" />
            <Poznamky v-if="smallScreen" />
            <Nahled v-for="video in Videa.slice(1)" :nazev="video.nazev" :url="video.url" />
        </section>
        <Poznamky class="ml-3 max-sm:hidden"/>
    </main>
</template>
