<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { hasLocalStorage, handleDrop, refreshList } from './parserKesek'
import type { IntKeska, Sekce } from "./parserKesek";
import Keska from './komponenty/nastenka/Keska.vue'
import summonNotif from "@/komponenty/ostatni/summonNotif"

import NavrchIkona from "@/ikony/navrch.svg"
import MoveIkona from "@/ikony/move.svg"
import SmazatIkona from "@/ikony/smazat.svg"
import EditIkona from "@/ikony/edit.svg"
import PridatIkona from "@/ikony/plus.svg"
import VybratIkona from "@/ikony/check.svg"
import NastaveniIkona from "@/ikony/gear.svg"
import NapovedaIkona from "@/ikony/napoveda.svg"
import ImportIkona from "@/ikony/import.svg"
import ExportIkona from "@/ikony/export.svg"
import Napoveda from './komponenty/nastenka/napoveda.vue';

const pretahuje = ref(false)

const vsechnyKesky = ref<IntKeska[]>([])
const vsechnySekce = ref<Sekce[]>([])

const editaceJmena = ref(-1)

const input = ref<HTMLInputElement>()
const importBackup = ref<HTMLInputElement>()
const hasLS = hasLocalStorage()

onMounted(() => {
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
})

async function dropped(e: Event) {
    
    let text = await input.value?.files?.[0].text()
    if (text == undefined) return
    
    let parsed = await handleDrop(text)
    console.log(parsed)
    
    pretahuje.value = false;
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
}

const filtrovaneKesky = (index: number) => {
    return vsechnyKesky.value.filter(x => x.sekce == index)
}
const helpOpen = ref(false)

const exportData = () => {
    let data = localStorage.getItem("nastenka")


    var blob = new Blob([], {type: " application/json"});
    var downloadUrl = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "Nastenka-" + Date.now().toString();
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(downloadUrl);
    summonNotif('Export byl stažen!')
}

const removeCache = (index: number) => {
    vsechnyKesky.value.splice(index, 1)
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value)!)
}

const selectMode = ref(false)
const currentlyDragging = ref(false)
</script>

<template>
<Napoveda :open="helpOpen" />
<main class="mx-auto w-full" @dragover="pretahuje=true" @dragleave="pretahuje=false">
 <!-- <div class="relative p-1 m-4 mx-auto w-96 rounded-lg border-2 border-dashed border-geo-400 text-geo-400 file:bg-red-300" :class="{'bg-geo-300': pretahuje}">
     <p>Přetáhněte, nebo vyberte .gpx soubor</p>
    </div> -->
    <!-- To pak přepni!! -->
 <input ref="importBackup" type="file" accept=".json" name="" id="" class="hidden" @input="dropped">
 <input ref="input" type="file" accept=".gpx" name="" id="" multiple class="hidden absolute inset-0 z-50 w-screen h-screen opacity-0" @input="dropped">

 <nav class="flex relative justify-between h-10" :class="{'opacity-30 pointer-events-none': !hasLS, 'drop-shadow-2xl shadow-geo-400 !bg-black': pretahuje}">
     <div class="flex gap-1 mr-6 h-full">
        <button @click="input?.click()" class="flex relative gap-2 items-center pl-4 ml-2 font-bold navButton" v-if="!selectMode">
            <PridatIkona class="scale-75" />
            <span class="max-sm:hidden">Přidat kešky</span>
        </button>
        <button @click="selectMode = !selectMode" class="flex relative gap-2 items-center pl-4 ml-2 font-bold navButton">
            <VybratIkona class="scale-75" />
            <span class="max-sm:hidden" v-if="!selectMode">Vybrat</span>
            <span class="max-sm:hidden" v-else>Zpět</span>
        </button>
    </div>
    <div class="flex gap-1 mr-6 h-full" v-if="!selectMode">
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="importBackup?.click()">
            <ImportIkona class="scale-75" />
            <span class="max-sm:hidden">Import</span>
        </button>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="exportData">
            <ExportIkona class="scale-75" />
            <span class="max-sm:hidden">Export</span>
        </button>
        <button class="flex relative items-center pl-4 font-bold navButton"><NastaveniIkona class="scale-75 stroke-black" /></button>
        <button class="flex relative items-center pl-4 font-bold navButton" @click="helpOpen = !helpOpen"><NapovedaIkona class="scale-75" /></button>
    </div>
    <div class="flex gap-1 mr-6 h-full" v-else>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="importBackup?.click()">
            <SmazatIkona class="scale-75" stroke="black"/>
            <span class="max-sm:hidden">Smazat</span>
        </button>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="exportData">
            <MoveIkona class="scale-75" />
            <span class="max-sm:hidden">Přesunout</span>
        </button>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="exportData">
            <NavrchIkona class="scale-75" />
            <span class="max-sm:hidden">Na vrch</span>
        </button>
    </div>
 </nav>

 <div class="flex gap-5 justify-center mt-3" v-if="hasLS">
     <div class="w-96 h-[60rem] max-h-[70vh]" v-for="(sekce, index) in vsechnySekce">
        <div :style="{background: sekce.barva}" @click="editaceJmena = index" class="flex justify-between items-center pr-2 text-xl font-extrabold text-white cursor-pointer group">
           <input v-if="editaceJmena == index" type="text" autocomplete="off" autofocus class="p-1.5 bg-black bg-opacity-30 outline-none" v-model="sekce.jmeno">
           <h2 class="p-1.5" v-else>{{ sekce.jmeno }}</h2>
           
           <EditIkona v-if="editaceJmena" class="w-5 h-5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <section class="flex overflow-y-auto flex-col w-full h-full bg-geo-300">
            <Keska
                v-for="(keska, ind) in filtrovaneKesky(index)"
                v-bind="keska"
                :index="ind"
                :select-mode="selectMode"
                :currently-dragging="currentlyDragging"
                @started-dragging="currentlyDragging = true"
                @ended-dragging="currentlyDragging = false"
                @remove-cache="removeCache"
            />
        </section>
    </div>
    <hr class="w-1.5 h-full bg-white border-none">
 </div>
 <div v-else class="flex flex-col justify-center items-center px-2 mt-7 w-full text-2xl font-light text-center text-white opacity-70">
     <p>K fungování nástěnky je potřeba lokální úložiště/cookies.</p>
 </div>
</main>

</template>
