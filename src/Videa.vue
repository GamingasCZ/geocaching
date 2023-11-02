<script setup lang="ts">
import Nahled from './komponenty/videa/nahled.vue';
import Poznamky from './komponenty/videa/sidebar.vue'

</script>

<template>
    <main class="flex justify-center mx-auto">
        <section class="flex flex-wrap gap-4 max-w-4xl">
            <Nahled v-for="i in 10" />
        </section>
        <Poznamky />
    </main>
</template>