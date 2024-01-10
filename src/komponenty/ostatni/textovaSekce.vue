<script setup lang="ts">
import { defineComponent, type Component } from 'vue';


defineProps<{
    nadpis: string;
    text: string;
    addComponent: Component;
    compProps: any;
}>()

</script>

<template>
<section class="relative underlineThick textSekce">
    <header class="pb-5 w-max text-2xl font-semibold bg-geo-400">{{ nadpis }}</header>
    <div class="box-border overflow-y-auto px-2 py-1 max-h-72 bg-geo-300">
        <p v-html="text"></p>
        <component :is="addComponent" v-bind="compProps"/>
    </div>
</section>
</template>

<style>
.textSekce p a {
    text-decoration: underline 2px;
}

.textSekce ul {
    margin-left: 2rem;
}
</style>