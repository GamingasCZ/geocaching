<script setup lang="ts">

import ZobrazitIkona from "@/ikony/mapa.svg"
import UpravitIkona from "@/ikony/edit.svg"
import SmazatIkona from "@/ikony/smazat.svg"
import type { IntKeska, Waypoint } from "@/parserKesek";
import { convert } from "geo-coordinates-parser"
import { computed } from "vue";

interface extras {
    def?: boolean;
    editing?: false;
    keska?: IntKeska;
    ind?: number
}

const props = defineProps<Waypoint & extras>()
const emit = defineEmits<{
    (e: "goToPoint", prop: {lat: number, lon: number}): void
    (e: "removePoint", index: number): void
    (e: "cancel"): void
    (e: "save"): void
}>()

const coords = computed(() => convert(`${props.latitude},${props.longitude}`, 1).toCoordinateFormat(convert.to.DMS).split(','))

</script>

<template>
    <div class="relative p-1 bg-black bg-opacity-20">

        <div>
            <div class="flex gap-1 items-center mb-2">
                <ZobrazitIkona class="scale-75" v-if="def" />
                <h2 class="mr-10 text-lg font-medium leading-none" v-if="!editing"><span v-if="ind != undefined">{{ ind + 1 }}) </span>{{ jmeno || 'Nepojmenovaný' }}</h2>
                <input type="text" v-else placeholder="Název bodu" v-model="keska.jmeno" class="bg-black bg-opacity-20">
            </div>
            <div class="flex flex-col pl-2" v-if="!editing">
                <span>{{ coords[0] }}</span>
                <span>{{ coords[1] }}</span>
            </div>
            <div class="flex flex-col pl-2" v-else>
                <div class="grid grid-cols-7" v-for="i in ['N', 'E']">
                    <input type="text" placeholder="0" class="text-center bg-black bg-opacity-20">
                    <span class="text-xl font-bold">°</span>
                    <input type="text" placeholder="0" class="text-center bg-black bg-opacity-20">
                    <span class="text-xl font-bold">'</span>
                    <input type="text" placeholder="0" class="text-center bg-black bg-opacity-20">
                    <span class="text-xl font-bold">"</span>
                    <span class="text-xl font-bold">{{ i }}</span>
                </div>
            </div>

        </div>
        <div class="grid grid-cols-2 gap-2 p-2 w-full" v-if="editing">
            <button class="flex col-span-2 items-center w-full border-2 border-black"><ZobrazitIkona class="scale-75" />Vybrat z mapy</button>
            <button class="border-2 border-black hover:bg-black hover:bg-opacity-40" @click="emit('cancel')">Zrušit</button>
            <button class="bg-geo-400 hover:bg-black hover:bg-opacity-40" @click="emit('save')">Uložit</button>
        </div>
        <div class="flex absolute top-0 right-1 flex-col" v-else>
            <button title="Zobrazit na mapě" @click="emit('goToPoint', {lat: latitude, lon: longitude})" class="w-max border-2 border-black scale-75 hover:bg-black hover:bg-opacity-20"><ZobrazitIkona class="scale-75" /></button>
            <button v-if="!def && ind" @click="emit('removePoint', ind)" title="Smazat" class="w-max border-2 border-black scale-75 hover:bg-black hover:bg-opacity-20"><SmazatIkona class="scale-75" stroke="black" /></button>
        </div>
    </div>
</template>