<script setup lang="ts">
import { inject } from 'vue';

import SmazatIkona from "@/ikony/smazat.svg"
import EditIkona from "@/ikony/edit.svg"


defineProps<{
    poznamky: [string, string, string, string, number][]
}>()


const skocit = inject<(arg0: number) => void>("videoSkocitNaCas")!
const smazat = inject<(arg0: number) => void>("smazatPoznamku")!
</script>

<template>
<button @click="skocit(poznamka[4])" @dblclick="smazat(poznamka[4])" class="relative p-1 m-1 w-full text-left border-b-4 drop-shadow-xl group bg-ext-zlt shadow-black noteFooter border-b-ext-fia" v-for="poznamka in poznamky">
    <div class="float-right px-1 py-0.5 bg-black bg-opacity-30 rounded-md">{{ poznamka[2] }}</div>
    <h2 class="w-9/12 text-xl font-medium break-words">{{ poznamka[0] }}</h2>
    <p class="text-sm break-words">{{ poznamka[1] }}</p>
    <div class="flex gap-2 mt-2 group-hover:visible">
        <!-- <button class="p-0.5 border-2 border-black">Smazat</button> -->
    </div>
</button>
</template>