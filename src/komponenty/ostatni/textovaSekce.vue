<script setup lang="ts">
import type { Component } from 'vue';


defineProps<{
    nadpis: string;
    text: string;
    addComponent: Component
    compProps: any
}>()

</script>

<template>
<section class="relative underlineThick">
    <header class="pb-5 w-max text-2xl font-semibold bg-geo-400">{{ nadpis }}</header>
    <p class="box-border px-2 py-1 bg-geo-300">{{ text }}</p>
    <component :is="addComponent" v-bind="compProps" />
</section>
</template>