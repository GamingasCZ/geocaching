<script setup lang="ts">
import clanky from "@/ikony/clanky.svg";
import logo from "@/ikony/scrollbar1.svg";
import jakZacit from "@/ikony/scrollbar2.svg";
import odkazy from "@/ikony/scrollbar3.svg";
import obrazky from "@/ikony/scrollbar4.svg";
import { inject, ref } from "vue";

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
const currScroll = inject<number>("currScroll")

</script>

<template>
    <section
        :class="{'!translate-x-16': !shown}"
        class="flex items-center fixed transition-transform translate-x-0 right-0 flex-col z-40 justify-between h-[35rem] max-h-[75vh] top-1/2 -translate-y-1/2 mr-2">
        <div :class="{'brightness-50 hue-rotate-30': currScroll != 0}" class="rounded-full border-4 transition scale-100 cursor-pointer aspect-square border-geo-400 hover:scale-105 active:scale-110">
            <logo @click="emit('goto', 0)"
                class="" />
        </div>
        <hr :class="{'brightness-50 hue-rotate-30': ![0,1].includes(currScroll!)}" class="w-1 h-full border-none transition bg-geo-400">
        <div :class="{'brightness-50 hue-rotate-30': currScroll != 1}" class="rounded-full border-4 transition scale-100 cursor-pointer aspect-square border-geo-400 hover:scale-105 active:scale-110">
            <jakZacit @click="emit('goto', 1)"
                class="" />
        </div>
        <hr :class="{'brightness-50 hue-rotate-30': ![2, 1].includes(currScroll!)}" class="w-1 h-full border-none transition bg-geo-400">
        <div :class="{'brightness-50 hue-rotate-30': currScroll != 2}" class="rounded-full border-4 transition scale-100 cursor-pointer aspect-square border-geo-400 hover:scale-105 active:scale-110">
            <odkazy @click="emit('goto', 2)"
                class="" />
        </div>
        <hr :class="{'brightness-50 hue-rotate-30': ![2, 3].includes(currScroll!)}" class="w-1 h-full border-none transition bg-geo-400">
        <div :class="{'brightness-50 hue-rotate-30': currScroll != 3}" class="rounded-full border-4 transition scale-100 cursor-pointer aspect-square border-geo-400 hover:scale-105 active:scale-110">
            <obrazky @click="emit('goto', 3)"
                class="" />
        </div>
</section></template>