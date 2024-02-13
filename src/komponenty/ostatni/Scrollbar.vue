<script setup lang="ts">
import clanky from "@/ikony/clanky.svg";
import { ref } from "vue";

const emit = defineEmits<{
    (e: "goto", ind: number): void
}>()

const shown = ref(true)
let timeout: number
const startTimeout = () => {
    clearTimeout(timeout)
    shown.value = true
    timeout = setTimeout(() => {
        shown.value = false
    }, 1500);
}

document.body.addEventListener("mousemove", startTimeout)
document.body.addEventListener("wheel", startTimeout)

</script>

<template>
    <section
        :class="{'!translate-x-16': !shown}"
        class="flex items-center fixed transition-transform translate-x-0 right-0 flex-col z-40 justify-between h-[35rem] top-32 mr-2">
        <clanky @click="emit('goto', 0)"
            class="w-8 h-24 rounded-full border-4 transition-transform scale-100 cursor-pointer hover:scale-105 active:scale-110 aspect-square border-geo-400" />
        <hr class="w-1 h-full border-none bg-geo-400">
        <clanky @click="emit('goto', 1)"
            class="w-8 h-24 rounded-full border-4 transition-transform scale-100 cursor-pointer hover:scale-105 active:scale-110 aspect-square border-geo-400" />
        <hr class="w-1 h-full border-none bg-geo-400">
        <clanky @click="emit('goto', 2)"
        class="w-8 h-24 rounded-full border-4 transition-transform scale-100 cursor-pointer hover:scale-105 active:scale-110 aspect-square border-geo-400" />
        <hr class="w-1 h-full border-none bg-geo-400">
        <clanky @click="emit('goto', 3)"
        class="w-8 h-24 rounded-full border-4 transition-transform scale-100 cursor-pointer hover:scale-105 active:scale-110 aspect-square border-geo-400" />
</section></template>