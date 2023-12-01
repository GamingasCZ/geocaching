<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { hasLocalStorage, handleDrop, refreshList } from './parserKesek'
import type { IntKeska, Sekce } from "./parserKesek";
import Keska from './komponenty/nastenka/Keska.vue'

import EditIkona from "@/ikony/edit.svg"
import PridatIkona from "@/ikony/plus.svg"
import VybratIkona from "@/ikony/check.svg"
import NastaveniIkona from "@/ikony/gear.svg"
import NapovedaIkona from "@/ikony/napoveda.svg"
import ImportIkona from "@/ikony/import.svg"
import ExportIkona from "@/ikony/export.svg"

const pretahuje = ref(false)
const neplatnaKeskaPopup = ref(false)

const vsechnyKesky = ref<IntKeska[]>([])
const vsechnySekce = ref<Sekce[]>([])

const editaceJmena = ref(-1)

const input = ref<HTMLInputElement>()
const hasLS = hasLocalStorage()

onMounted(() => {
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
})

async function dropped(e: Event) {
    let text = await input.value?.files?.[0].text()
    if (text == undefined) return
    
    let parsed = handleDrop(text)
    if (!parsed) {
        neplatnaKeskaPopup.value = true
        setTimeout(() => neplatnaKeskaPopup.value = false, 1000)
    }
    
    pretahuje.value = false;
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
}

const filtrovaneKesky = (index: number) => {
    return vsechnyKesky.value.filter(x => x.sekce == index)
}
</script>

<template>
<main class="mx-auto w-full">
 <!-- <div class="relative p-1 m-4 mx-auto w-96 rounded-lg border-2 border-dashed border-geo-400 text-geo-400 file:bg-red-300" :class="{'bg-geo-300': pretahuje}">
     <p>Přetáhněte, nebo vyberte .gpx soubor</p>
    </div> -->
    <!-- To pak přepni!! -->
 <input ref="input" type="file" accept=".gpx" name="" id="" class="hidden absolute top-0 w-full h-full opacity-0" @dragover="pretahuje=true" @dragleave="pretahuje=false" @input="dropped">
 <p v-if="!hasLS" class="fixed top-20 left-1/2 p-2 w-max text-xl -translate-x-1/2 bg-geo-400">Nemáš zaplé místní úložiště/cookies!</p>
 <p v-if="neplatnaKeskaPopup">Některé kešky se nepodařilo načíst!</p>

 <nav class="flex relative justify-between h-10">
     <div class="flex gap-1 mr-6 h-full">
        <button @click="input?.click()" class="flex relative gap-2 items-center pl-4 ml-2 font-bold navButton">
            <PridatIkona class="scale-75" />
            <span class="max-sm:hidden">Přidat kešky</span>
        </button>
        <button @click="input?.click()" class="flex relative gap-2 items-center pl-4 ml-2 font-bold navButton">
            <VybratIkona class="scale-75" />
            <span class="max-sm:hidden">Vybrat</span>
        </button>
    </div>
    <div class="flex gap-1 mr-6 h-full">
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton">
            <ImportIkona class="scale-75" />
        </button>
        <span class="max-sm:hidden">Import</span>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton">
            <ExportIkona class="scale-75" />
            <span class="max-sm:hidden">Export</span>
        </button>
        <button class="flex relative items-center pl-4 font-bold navButton"><NastaveniIkona class="scale-75" /></button>
        <button class="flex relative items-center pl-4 font-bold navButton"><NapovedaIkona class="scale-75" /></button>
    </div>
 </nav>

 <div class="flex gap-5 justify-center mt-3">
     <div class="w-96 h-[60rem] max-h-[70vh]" v-for="(sekce, index) in vsechnySekce">
        <div :style="{background: sekce.barva}" @click="editaceJmena = index" class="flex justify-between items-center pr-2 text-xl font-extrabold text-white cursor-pointer group">
           <input v-if="editaceJmena == index" type="text" autocomplete="off" autofocus class="p-1.5 bg-black bg-opacity-30 outline-none" v-model="sekce.jmeno">
           <h2 class="p-1.5" v-else>{{ sekce.jmeno }}</h2>
           
           <EditIkona class="w-5 h-5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <section class="flex flex-col w-full h-full bg-geo-300">
            <Keska v-for="keska in filtrovaneKesky(index)" v-bind="keska" />
        </section>
    </div>
    <hr class="w-1.5 h-full bg-white border-none">
 </div>
</main>

</template>
