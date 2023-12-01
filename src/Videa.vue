<script setup lang="ts">
import Videa from './assety/videa';
import Nahled from './komponenty/videa/nahled.vue';
import Poznamky from './komponenty/videa/sidebar.vue'

</script>

<template>
    <main class="flex justify-between mx-auto">
        <section class="flex flex-wrap gap-4 mx-4 max-w-4xl nahledVidea">
            <Nahled v-for="video in Videa" v-bind="video" />
        </section>
            <Poznamky class=""/>
    </main>
</template>