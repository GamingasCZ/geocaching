<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { hasLocalStorage, handleDrop, refreshList, makeSectionArray } from './parserKesek'
import type { IntKeska, Sekce } from "./parserKesek";
import Keska from './komponenty/nastenka/Keska.vue'
import summonNotif from "@/komponenty/ostatni/summonNotif"
import Mapa from "./komponenty/nastenka/mapa.vue"
import { Nastaveni as nastaveniNastenky } from './komponenty/nastenka/nastaveniNastenky';
import Nastaveni from './komponenty/nastenka/nastaveni.vue';

import PotvrditIkona from "@/ikony/potvrdit.svg"
import NicIkona from "@/ikony/nic.svg"
import RazeniIkona from "@/ikony/razeni.svg"
import HledatIkona from "@/ikony/hledat.svg"
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
import barvyKesek from './assety/barvyKesek';
import ImportDialog from './komponenty/nastenka/importDialog.vue';

const pretahuje = ref(false)

const vsechnyKesky = ref<Array<IntKeska[]>>(makeSectionArray())
const vsechnySekce = ref<Sekce[]>([])

const editaceJmena = ref(-1)

const input = ref<HTMLInputElement>()
const importBackup = ref<HTMLInputElement>()
const hasLS = hasLocalStorage()

onMounted(() => {
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
})

async function dropped(e: Event) {
    
    let text = input.value?.files
    if (text == undefined) return
    
    let parsed = await handleDrop(text, draggingOverSection.value)
    
    pretahuje.value = false;
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
}

const helpOpen = ref(false)

const exportData = () => {
    let data = localStorage.getItem("nastenka")

    var blob = new Blob([data], {type: " application/json"});
    var downloadUrl = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "Nastenka-" + Date.now().toString();
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(downloadUrl);
    summonNotif('Export byl stažen!')
}

const removeCache = (index: number, sekce: number) => {
    vsechnyKesky.value[sekce].splice(index, 1)
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value)!)
}
const removeSelectedCaches = (selectedArray: [number, number][]) => {
    selectedArray.forEach(keska => {
        vsechnyKesky.value[keska[1]][keska[0]] = 0
    });
    
    let i = 0
    vsechnyKesky.value.forEach(keska => {
        vsechnyKesky.value[i] = keska.filter(x => x != 0)
        i += 1
    })
    selectMode.value = false
    selectedCaches.value = []
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value)!)
}

const zobrazenaNaMapeKeska = ref({
    jmeno: "",
    napoveda: "",
    pozice: {latitude: 0, longtitude: 0},
    geokod: ""
})

const mapaOtevrena = ref(false)
const otevritMapu = (index: number, sekce: number) => {
    let keska = vsechnyKesky.value[sekce][index]
    zobrazenaNaMapeKeska.value.jmeno = keska.jmeno
    zobrazenaNaMapeKeska.value.napoveda = keska.napoveda
    zobrazenaNaMapeKeska.value.pozice = {latitude: keska.latitude, longtitude: keska.longtitude}
    zobrazenaNaMapeKeska.value.geokod = keska.kod
    mapaOtevrena.value = !mapaOtevrena.value
}

const compactMode = ref(true)
const selectMode = ref(false)
const cardBeingDraggedIndex = ref(-1)
const cardBeingDraggedSection = ref(0)
const hoveredOverCardIndex = ref(-1)
const draggingOverSection = ref(0)
const hoveringOverCardTop = ref(false)
const moveCard = () => {
    if (cardBeingDraggedIndex.value == hoveredOverCardIndex.value && cardBeingDraggedSection.value == draggingOverSection.value) return
    let presouvanaKeska = vsechnyKesky.value[cardBeingDraggedSection.value][cardBeingDraggedIndex.value]
    vsechnyKesky.value[cardBeingDraggedSection.value].splice(cardBeingDraggedIndex.value, 1)

    vsechnyKesky.value[draggingOverSection.value].splice(hoveredOverCardIndex.value == -1 ? vsechnyKesky.value[draggingOverSection.value].length : hoveredOverCardIndex.value, 0, presouvanaKeska)
    
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value)!)
    cardBeingDraggedIndex.value = -1
}

const leaveArea = () => {
    setTimeout(() => (hoveredOverCardIndex.value = -1), 5) // AAAAAAAA!!!!!
}

const filtrZobrazen = ref(-1)
const filtrAktivni = ref(-1)
const hledatKesky = (e: SubmitEvent, sekce: index) => {
    [vsechnyKesky.value] = refreshList()
    let searchText = (e.target as HTMLFormElement).elements[0].value.toLowerCase()
    filtrAktivni.value = sekce
    let filtrovaneKesky = vsechnyKesky.value[sekce].filter(keska => keska.jmeno.toLowerCase().includes(searchText))
    vsechnyKesky.value[sekce] = filtrovaneKesky
}

const zmenitSekci = () => {
    editaceJmena.value = -1
    localStorage.setItem("sekce", JSON.stringify(vsechnySekce.value)!)
}

const selectedCaches = ref<[number, number][]>([])
const modifySelections = (index: number, sekce: number, shiftSelection: boolean = false) => {
    if (!selectMode.value) selectMode.value = true
    
    // Vybírání shiftem
    // if (shiftSelection) {
    //     let lastSelected = selectedCaches.value.slice(selectedCaches.value.length-1)[0] ?? [0, sekce]
    //     if (lastSelected[1] != sekce) return // Jde vybírat jen mezi stejnýma sekcema
    //     let range = [lastSelected[0], index].sort()
    //     for (let i = range[0]; i < range[1]; i++) {
    //         selectedCaches.value.push([i, sekce])
    //         test.value[i].select()
    //     }
    // }
    // else {
        let findIndex = selectedCaches.value.map(x => x[0] == index && x[1] == sekce ? 1 : 0)
        if (findIndex.includes(1))
        selectedCaches.value.splice(findIndex.indexOf(1), 1)
        else
        selectedCaches.value.push([index, sekce])
    
    // }
    
    if (selectedCaches.value.length == 0) {
        selectMode.value = false
    }

}

const importExtra = ref({
    open: false,
    data: [],
    datum: ""
})
const importCache = async (e: Event) => {
    let file = await e.target.files.item(0).text()
    let name = e.target.files.item(0).name
    let datum = new Date(parseInt(name.split("-")[1].split(".")[0]))
    
    let importData;
    try {
        importData = JSON.parse(file)
        if (importData == null) throw new Error("Neni import")
    }
    catch (e) {
        summonNotif("Soubor není platný import!")
        return
    }
    importExtra.value.datum = `${datum.getDay()}.${datum.getMonth()}.${datum.getFullYear()}`
    importExtra.value.open = !importExtra.value.open
    importExtra.value.data = importData
}

const test = ref()
const settingsOpen = ref(false)
</script>

<template>
<Mapa v-bind="zobrazenaNaMapeKeska" :open="mapaOtevrena" />
<ImportDialog :open="importExtra.open" :zaloha="importExtra" @update-caches="vsechnyKesky = $event"/>
<Napoveda :open="helpOpen" />

<main class="mx-auto w-full" @dragover="pretahuje=true" @dragleave="pretahuje=false">
 <!-- <div class="relative p-1 m-4 mx-auto w-96 rounded-lg border-2 border-dashed border-geo-400 text-geo-400 file:bg-red-300" :class="{'bg-geo-300': pretahuje}">
     <p>Přetáhněte, nebo vyberte .gpx soubor</p>
    </div> -->
    <!-- To pak přepni!! -->
 <input ref="importBackup" type="file" accept=".json" name="" id="" class="hidden" @input="importCache">
 <input ref="input" type="file" accept=".gpx" name="" id="" multiple class="hidden absolute inset-0 z-50 w-screen h-screen opacity-0" @input="dropped">

 <nav class="flex relative justify-between h-10" :class="{'opacity-30 pointer-events-none': !hasLS, 'drop-shadow-2xl shadow-geo-400 !bg-black': pretahuje}">
    <Nastaveni :open="settingsOpen" />

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
        <button class="flex relative items-center pl-4 font-bold navButton" @click="settingsOpen = !settingsOpen"><NastaveniIkona class="scale-75 stroke-black" /></button>
        <button class="flex relative items-center pl-4 font-bold navButton" @click="helpOpen = !helpOpen"><NapovedaIkona class="scale-75" /></button>
    </div>
    <div class="flex gap-1 mr-6 h-full" v-else>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="removeSelectedCaches(selectedCaches)">
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
     <div class="w-96 h-[60rem] max-h-[70vh]" v-for="(sekce, indexSekce) in vsechnySekce" @dragover="draggingOverSection = indexSekce">

        <!-- Jméno sekce -->
        <div :style="{background: sekce.barva}" @click="editaceJmena = indexSekce" class="flex justify-between items-center text-xl font-extrabold text-white cursor-pointer group">
           <div class="w-full">
                <form @submit.prevent="zmenitSekci" class="flex w-full h-max" v-if="editaceJmena == indexSekce">
                    <input type="text" maxlength="15" autocomplete="off" autofocus class="p-1.5 bg-black bg-opacity-30 outline-none grow" v-model="sekce.jmeno">
                    <button type="submit" class="w-10 min-h-full bg-black bg-opacity-40">
                        <PotvrditIkona class="mx-auto scale-75" stroke="white" />
                    </button>
                    <button type="button" class="w-10 min-h-full bg-black bg-opacity-40">
                        <SmazatIkona class="mx-auto scale-75" stroke="white" />
                    </button>
                </form>
                <h2 class="p-1.5 text-black" v-else>{{ sekce.jmeno }}</h2>
           </div>

           <EditIkona v-if="editaceJmena != indexSekce" class="mr-2 w-5 h-5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        
        <section class="flex overflow-y-auto relative flex-col w-full h-full bg-geo-300" :style="{accentColor: sekce.barva, scrollbarColor: `${sekce.barva} var(--normal)`}">
            <!-- Hledani -->
            <form class="w-full grid grid-cols-[1fr_max-content] box-border" :style="{background: sekce.barva}" @submit.prevent="hledatKesky($event, indexSekce)" v-if="filtrZobrazen == indexSekce">
                <input type="text" placeholder="Hledat..." autocomplete="off" autofocus autocorrect="off" class="px-0.5 m-1 text-sm text-white bg-black bg-opacity-30 placeholder:text-white">
                <button type="submit" class="scale-75">
                    <HledatIkona />
                </button>
            </form>

            <!-- Barvy -->
            <div class="flex pb-2 w-full h-8 bg-black bg-opacity-10" :style="{background: sekce.barva}" v-else-if="editaceJmena == indexSekce">
                <button v-for="barva in barvyKesek" class="box-border p-0.5 w-full h-6 border-black scale-75 -skew-x-12 drop-shadow-sharp" @click="sekce.barva = barva" :class="{'border-4': sekce.barva == barva}" :style="{background: barva}"></button>
            </div>

            <!-- Toolbar -->
            <div class="flex sticky top-0 bottom-1 z-10 justify-around" :style="{background: sekce.barva}" v-else>
                <button class="flex gap-1 items-center font-bold" >
                    <RazeniIkona class="scale-75" />
                    <span>Řazení</span>
                </button>
                <button class="flex gap-1 items-center font-bold" @click="filtrZobrazen = indexSekce">
                    <HledatIkona class="scale-75" />
                    <span>Hledat</span>
                </button>
            </div>

            <!-- Napoveda -->
            <div class="flex absolute top-1/2 left-1/2 flex-col items-center w-max text-center opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none" v-if="!vsechnyKesky[indexSekce].length">
                <NicIkona />
                <h3 class="text-xl font-medium">Nic tu není...</h3>
                <p>Přetáhněte sem nějaké kešky</p>
            </div>

            <Keska
                v-for="(keska, ind) in vsechnyKesky[indexSekce]"
                v-bind="keska"
                ref="test"
                :index="ind"
                :select-mode="selectMode"
                :compact-mode="nastaveniNastenky.zobrazeni"
                :disable-child-dragover="cardBeingDraggedIndex > -1"
                @modify-selections="modifySelections($event.index, indexSekce, $event.shiftSelection)"
                @started-dragging="cardBeingDraggedIndex = $event; cardBeingDraggedSection = indexSekce"
                @dragged-over-card="hoveredOverCardIndex = $event.ind; hoveringOverCardTop = $event.draggingOverTop"
                @left-drag-area="leaveArea"
                @ended-dragging="moveCard"
                @remove-cache="removeCache($event, indexSekce)"
                @show-on-map="otevritMapu($event, indexSekce)"
            />
        </section>
    </div>
 </div>
 <div v-else class="flex flex-col justify-center items-center px-2 mt-7 w-full text-2xl font-light text-center text-white opacity-70">
     <p>K fungování nástěnky je potřeba lokální úložiště/cookies.</p>
 </div>
</main>

</template>
