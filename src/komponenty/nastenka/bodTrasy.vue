<script setup lang="ts">

import ZobrazitIkona from "@/ikony/mapa.svg"
import UpravitIkona from "@/ikony/edit.svg"
import SmazatIkona from "@/ikony/smazat.svg"
import type { IntKeska, Waypoint } from "@/parserKesek";
import { convert } from "geo-coordinates-parser"
import { computed, inject, ref, watch } from "vue";

interface extras {
    def?: boolean;
    editing?: false;
    keska?: IntKeska;
    ind?: number;
    klikPoloha?: [number, number];
}

const props = defineProps<Waypoint & extras>()
const emit = defineEmits<{
    (e: "goToPoint", prop: {lat: number, lon: number}): void
    (e: "removePoint", index: number): void
    (e: "pickingPoint"): void
    (e: "cancel"): void
    (e: "save", ext: Waypoint): void
}>()

const parseDMS = (latlon: [number, number]) => {
    let poloha = []
    for (let i = 0; i < 2; i++) {
        let stup = Math.trunc(latlon[i])
        let min = (latlon[i] % 1) * 60
        let sek = Math.trunc(min % 1 * 60)
        poloha.push([stup, Math.trunc(min), sek])            
    }
    return poloha
}

const coords = computed(() => parseDMS([props.latitude, props.longitude]))
const nazevBodu = ref(`Bod ${props.keska?.waypointy.length}`)
const coordsEdit = computed(() => {
    if (props.klikPoloha) {
        return parseDMS(props.klikPoloha)
    }
    else return [[null, null, null],[null, null, null]]
})

const save = () => {
    let pozice = []
    if (!props.klikPoloha) {
        for (let i = 0; i < 2; i++) {
            pozice.push(coordsEdit.value[i][0] + coordsEdit.value[i][1]/60 + coordsEdit.value[i][1]/3600)
        }
    }
    else pozice = props.klikPoloha
    let data: Waypoint =  {jmeno: nazevBodu.value, latitude: pozice[1], longitude: pozice[0], editing: false}
    emit('save', data)
}

</script>

<template>
    <div class="relative p-1 bg-black bg-opacity-20">

        <div>
            <div class="flex gap-1 items-center mb-2">
                <ZobrazitIkona class="scale-75" v-if="def" />
                <h2 class="mr-10 text-lg font-medium leading-none" v-if="!editing"><span v-if="ind != undefined">{{ ind + 1 }}) </span>{{ jmeno || 'Nepojmenovaný' }}</h2>
                <input type="text" v-else placeholder="Název bodu" v-model="nazevBodu" class="p-1 font-bold text-white bg-black bg-opacity-20">
            </div>
            <div class="flex flex-col pl-2" v-if="!editing">
                <span>{{ coords[0][0] }}° {{ coords[0][1] }}' {{ coords[0][2] }}" N </span>
                <span>{{ coords[1][0] }}° {{ coords[1][1] }}' {{ coords[1][2] }}" E</span>
            </div>
            <div class="flex flex-col pl-2" v-else>
                <div class="grid grid-cols-7" v-for="(i,j) in ['N', 'E']">
                    <input v-model="coordsEdit[j][0]" type="text" placeholder="0" class="mr-1 mb-1 font-bold text-center text-white bg-black bg-opacity-20">
                    <span class="text-xl font-bold">°</span>
                    <input v-model="coordsEdit[j][1]" type="text" placeholder="0" class="mr-1 mb-1 font-bold text-center text-white bg-black bg-opacity-20">
                    <span class="text-xl font-bold">'</span>
                    <input v-model="coordsEdit[j][2]" type="text" placeholder="0" class="mr-1 mb-1 font-bold text-center text-white bg-black bg-opacity-20">
                    <span class="text-xl font-bold">"</span>
                    <span class="text-xl font-bold">{{ i }}</span>
                </div>
            </div>

        </div>
        <div class="grid grid-cols-2 gap-2 p-2 w-full" v-if="editing">
            <button class="flex col-span-2 items-center w-full border-2 border-black" @click="emit('pickingPoint')"><ZobrazitIkona class="scale-75" />Vybrat z mapy</button>
            <button class="border-2 border-black hover:bg-black hover:bg-opacity-40" @click="emit('cancel')">Zrušit</button>
            <button class="bg-geo-400 hover:bg-black hover:bg-opacity-40" @click="save">Uložit</button>
        </div>
        <div class="flex absolute top-0 right-1 flex-col" v-else>
            <button title="Zobrazit na mapě" @click="emit('goToPoint', {lat: latitude, lon: longitude})" class="w-max border-2 border-black scale-75 hover:bg-black hover:bg-opacity-20"><ZobrazitIkona class="scale-75" /></button>
            <button v-if="!def && typeof(ind) == 'number'" @click="emit('removePoint', ind)" title="Smazat" class="w-max border-2 border-black scale-75 hover:bg-black hover:bg-opacity-20"><SmazatIkona class="scale-75" stroke="black" /></button>
        </div>
    </div>
</template>