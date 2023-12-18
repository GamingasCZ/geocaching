<script setup lang="ts">

interface extras {
    def?: boolean
}

const props = defineProps<Waypoint & extras>()
const emit = defineEmits<{
    (e: "goToPoint", prop: {lat: number, lon: number}): void
}>()

import ZobrazitIkona from "@/ikony/mapa.svg"
import UpravitIkona from "@/ikony/edit.svg"
import SmazatIkona from "@/ikony/smazat.svg"
import type { Waypoint } from "@/parserKesek";
import { convert } from "geo-coordinates-parser"
import { computed } from "vue";

const coords = computed(() => convert(`${props.latitude},${props.longitude}`, 1).toCoordinateFormat(convert.to.DMS).split(','))

</script>

<template>
    <div class="relative p-1 bg-black bg-opacity-20">

        <div>
            <div class="flex gap-1 items-center mb-2">
                <ZobrazitIkona class="scale-75" v-if="def" /><h2 class="mr-10 text-lg font-medium leading-none">{{ jmeno || 'Nepojmenovaný' }}</h2>
            </div>
            <div class="flex flex-col pl-2">
                <span>{{ coords[0] }}</span>
                <span>{{ coords[1] }}</span>
            </div>

        </div>
        <div class="flex absolute top-0 right-1 flex-col">
            <button title="Zobrazit na mapě" @click="emit('goToPoint', {lat: latitude, lon: longitude})" class="w-max border-2 border-black scale-75"><ZobrazitIkona class="scale-75" /></button>
            <button v-if="!def" title="Smazat" class="w-max border-2 border-black scale-75"><SmazatIkona class="scale-75" stroke="black" /></button>
        </div>
    </div>
</template>