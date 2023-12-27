<script setup lang="ts">
import Videa from './assety/videa';
import Nahled from './komponenty/videa/nahled.vue';
import Poznamky from './komponenty/videa/sidebar.vue'

</script>

<template>
    <main class="box-border flex justify-between pl-3 mx-auto">
        <section class="flex flex-wrap gap-4 mr-4 mb-8 max-w-4xl overflow-x-clip nahledVidea">
            <Nahled v-for="video in Videa" v-bind="video" />
        </section>
        <Poznamky class="ml-3 max-sm:hidden"/>
    </main>
</template>