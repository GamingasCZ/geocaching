<script setup lang="ts">
import { ref, onMounted, nextTick, provide} from 'vue';
import { hasLocalStorage, handleDrop, refreshList, makeSectionArray, parseDistance } from './parserKesek'
import type { IntKeska, Sekce } from "./parserKesek";
import Keska from './komponenty/nastenka/Keska.vue'
import summonNotif from "@/komponenty/ostatni/summonNotif"
import Mapa from "./komponenty/nastenka/mapa.vue"
import { Nastaveni as nastaveniNastenky } from './komponenty/nastenka/nastaveniNastenky';
import Nastaveni from './komponenty/nastenka/nastaveni.vue';
import Vzdalenost from "node-geo-distance";
import barvyKesek from './assety/barvyKesek';

import ZavritIkona from "@/ikony/zavrit.svg"
import PotvrditIkona from "@/ikony/potvrdit.svg"
import NicIkona from "@/ikony/nic.svg"
import SouboryIkona from "@/ikony/soubory.svg"
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
import ImportDialog from './komponenty/nastenka/importDialog.vue';

const pretahuje = ref(false)

const vsechnyKesky = ref<IntKeska[][]>(makeSectionArray())
const vsechnySekce = ref<Sekce[]>([])

const editaceJmena = ref(-1)

const input = ref<HTMLInputElement>()
const importBackup = ref<HTMLInputElement>()
const hasLS = hasLocalStorage()

onMounted(() => {
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
    if (nastaveniNastenky.value.zakazatPolohu) return
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((nyniPozice) => {
            let tatoPoloha = {latitude: nyniPozice.coords.latitude, longitude: nyniPozice.coords.longitude}
            for (let i = 0; i < vsechnySekce.value.length; i++) {
                let j = 0
                vsechnyKesky.value[i].forEach((keska: IntKeska) => {
                    let polohaKesky = {latitude: keska.latitude, longitude: keska.longtitude}
                    let vzdalenost = parseDistance(parseFloat(Vzdalenost.vincentySync(tatoPoloha, polohaKesky)))
                    vsechnyKesky.value[i][j].vzdalenost = vzdalenost

                    j += 1
                })
            }

        }, (chyba) => {
            console.log("kurva")
        }, {enableHighAccuracy: true})
    }
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
    let dataKesky = localStorage.getItem("nastenka") ?? []
    let dataSekce = localStorage.getItem("sekce") ?? makeSectionArray()
    let hash = dataKesky.length + dataSekce.length

    var blob = new Blob([JSON.stringify([dataKesky, dataSekce, hash])], {type: " application/json"});
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
    geokod: "",
    waypointy: []
})

const mapaOtevrena = ref(false)
const otevritMapu = (index: number, sekce: number) => {
    let keska = vsechnyKesky.value[sekce][index]
    zobrazenaNaMapeKeska.value.jmeno = keska.jmeno
    zobrazenaNaMapeKeska.value.napoveda = keska.napoveda
    zobrazenaNaMapeKeska.value.pozice = {latitude: keska.latitude, longtitude: keska.longtitude}
    zobrazenaNaMapeKeska.value.geokod = keska.kod
    zobrazenaNaMapeKeska.value.waypointy = keska.waypointy
    zobrazenaNaMapeKeska.value.objekt = keska
    mapaOtevrena.value = !mapaOtevrena.value
}

const selectMode = ref(false)
const cardBeingDraggedIndex = ref(-1)
const cardBeingDraggedSection = ref(0)
const hoveredOverCardIndex = ref(-1)
const draggingOverSection = ref(0)
const hoveringOverCardTop = ref(false)
const moveCard = () => {
    if (cardBeingDraggedIndex.value == hoveredOverCardIndex.value && cardBeingDraggedSection.value == draggingOverSection.value) {
        hoveredOverCardIndex.value = -1
        cardBeingDraggedIndex.value = -1
        return
    }
    let presouvanaKeska = vsechnyKesky.value[cardBeingDraggedSection.value][cardBeingDraggedIndex.value]
    vsechnyKesky.value[cardBeingDraggedSection.value].splice(cardBeingDraggedIndex.value, 1)
    
    vsechnyKesky.value[draggingOverSection.value].splice(hoveredOverCardIndex.value == -1 ? vsechnyKesky.value[draggingOverSection.value].length : hoveredOverCardIndex.value, 0, presouvanaKeska)
    
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value)!)
    hoveredOverCardIndex.value = -1
    cardBeingDraggedIndex.value = -1
}

const leaveArea = () => {
    setTimeout(() => (hoveredOverCardIndex.value = -1), 5) // AAAAAAAA!!!!!
}

const filtrZobrazen = ref(-1)
const filtrAktivni = ref(-1)
const hledatKesky = (e: Event | -1, sekce: index) => {
    [vsechnyKesky.value] = refreshList()
    let searchText = e == -1 ? "" : (e.target as HTMLFormElement).elements[1].value.toLowerCase()
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
        let findIndex = selectedCaches.value.map(x => x[0] == index && x[1] == sekce ? 1 : 0)
    if (findIndex.includes(1))
        selectedCaches.value.splice(findIndex.indexOf(1), 1)
    else
        selectedCaches.value.push([index, sekce])
    
    if (selectedCaches.value.length == 0) {
        selectMode.value = false
    }

}

const importExtra = ref({
    open: false,
    data: [[],[],0],
    datum: ""
})
const importCache = async (e: Event) => {
    let file = await e.target?.files.item(0).text()
    let name = (e.target as HTMLInputElement).files!.item(0).name
    let datum = new Date(parseInt(name.split("-")?.[1]?.split(".")?.[0]))
    
    let importData;
    try {
        importData = JSON.parse(file)
        if (importData == null) throw new Error("Neni import")
        if (importData[0].length + importData[1].length != importData[2]) throw new Error("Blbej import")
    }
    catch (e) {
        summonNotif("Soubor není platný import!")
        return
    }
    importExtra.value.datum = `${datum.getDate()}.${datum.getMonth()+1}.${datum.getFullYear()}`
    if (datum as any == 'Invalid Date') importExtra.value.datum = -1 as any
    importExtra.value.open = !importExtra.value.open
    importExtra.value.data = [JSON.parse(importData[0]),JSON.parse(importData[1]), importData[2]];
    (e.target as HTMLInputElement).value = ''
}

const draggingWithFile = ref(-1)
const hoverWithFiles = (sekce: number) => {
    if (cardBeingDraggedIndex.value == -1) {
        draggingWithFile.value = sekce
    }
}

const dragDropFiles = async (e: DragEvent) => {
    let files = e.dataTransfer?.files!
    await handleDrop(files, draggingWithFile.value);
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()

    draggingWithFile.value = -1
}

const test = ref()
const settingsOpen = ref(-1)

const moveDropdownOpen = ref(-1)
const moveDropdownElement = ref<HTMLDivElement>()
const openDropdown = (which: any, indexSekce?: number) => {
    let dropdowns = [moveDropdownOpen, sortDropdownOpen, settingsOpen]

    dropdowns[which].value = indexSekce == undefined ? 1 : indexSekce
    nextTick(() => {
        document.body.addEventListener("mouseup", (e: MouseEvent) => {
            dropdowns[which].value = -1
        }, {once: true})
    })
}
const moveSelectedCaches = (doSekce: number) => {
    let zJinychSekci = selectedCaches.value.filter(x => x[1] != doSekce)
    zJinychSekci.forEach(vyb => {
        vsechnyKesky.value[doSekce].splice(0, 0, vsechnyKesky.value[vyb[1]][vyb[0]])
    })
    removeSelectedCaches(zJinychSekci)
}
const moveSelectedToTop = () => {
    let kSerazeni = [[],[],[]]
    selectedCaches.value.forEach(vyb => {
        let kes = vsechnyKesky.value[vyb[1]][vyb[0]]
        kSerazeni[vyb[1]].push(kes)
        vsechnyKesky.value[vyb[1]][vyb[0]] = 0
    })

    let i = 0
    vsechnyKesky.value.forEach(_ => {
        vsechnyKesky.value[i] = vsechnyKesky.value[i].filter(y => y != 0)
        vsechnyKesky.value[i] = kSerazeni[i].concat(vsechnyKesky.value[i])
        i += 1
    })
    console.log(vsechnyKesky.value)
    selectMode.value = false
    selectedCaches.value = []
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value)!)
}

const darkThemes = [1, 1, 0, 1, 1, 0, 0]
const shouldBeDark = (sekce: Sekce) => darkThemes[Object.values(barvyKesek).indexOf(sekce.barva)]

const podleAbecedy = (arr: IntKeska[]) => arr.sort((a, b) => a.jmeno[0].toLowerCase() > b.jmeno[0].toLowerCase())
const podleVzdalenosti = (arr: IntKeska[]) => arr.sort((a, b) => (a.vzdalenost ?? 0) > (b.vzdalenost ?? 0))
const podleDruhu = (arr: IntKeska[]) => arr.sort((a, b) => a.druh > b.druh)
const podleObtiznosti = (arr: IntKeska[]) => arr.sort((a, b) => a.obtiznost > b.obtiznost)
const podleData = (arr: IntKeska[]) => arr.sort((a, b) => a.datumVlozeni > b.datumVlozeni)

const sortDropdownOpen = ref(-1)
const vybraneRazeni = ref(0)
const razeniAktivni = ref(-1)
const zpusobyRazeni = [
    {
        nazev: "vzdálenosti",
        fun: podleVzdalenosti
    },
    {
        nazev: "druhu",
        fun: podleDruhu
    },
    {
        nazev: "obtížnosti",
        fun: podleObtiznosti
    },
    {
        nazev: "data přidání",
        fun: podleData
    },
    {
        nazev: "abecedy",
        fun: podleAbecedy
    },
]

const sortCaches = (natrvalo: boolean, sekceIndex: number) => {
    vsechnyKesky.value[sekceIndex] = zpusobyRazeni[vybraneRazeni.value].fun(vsechnyKesky.value[sekceIndex])
    if (natrvalo) localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value)!)
    else razeniAktivni.value = sekceIndex
    sortDropdownOpen.value = -1
}
const zrusitDocasnySort = () => {
    vsechnyKesky.value[razeniAktivni.value] = refreshList()[0][razeniAktivni.value]
    razeniAktivni.value = -1
}

const pridatSekci = () => {
    vsechnyKesky.value.splice(1, 0, [])
    vsechnySekce.value.splice(1, 0, {jmeno: 'Rozpracované', 'barva': barvyKesek.mystery})
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value))
    localStorage.setItem("sekce", JSON.stringify(vsechnySekce.value))
}

const smazatSekci = (ind: number) => {
    vsechnyKesky.value.splice(ind, 1)
    vsechnySekce.value.splice(ind, 1)
    localStorage.setItem("nastenka", JSON.stringify(vsechnyKesky.value))
    localStorage.setItem("sekce", JSON.stringify(vsechnySekce.value))
}

const smallScreen = ref(-1)
const modifyWindow = () => {
    smallScreen.value = window.outerWidth < 540 ? 0 : -1
}
window.addEventListener("resize", modifyWindow)
modifyWindow()

/* Sdílení vsech kesek */
provide("vsechnyKesky", vsechnyKesky)


</script>

<template>
<Mapa v-bind="zobrazenaNaMapeKeska" :open="mapaOtevrena" />
<ImportDialog :open="importExtra.open" :zaloha="importExtra" @update-caches="vsechnyKesky = $event"/>
<Napoveda :open="helpOpen" />

<main class="mx-auto w-full">
 <!-- <div class="relative p-1 m-4 mx-auto w-96 rounded-lg border-2 border-dashed border-geo-400 text-geo-400 file:bg-red-300" :class="{'bg-geo-300': pretahuje}">
     <p>Přetáhněte, nebo vyberte .gpx soubor</p>
    </div> -->
    <!-- To pak přepni!! -->
 <input ref="importBackup" type="file" accept=".json" name="" id="" class="hidden" @input="importCache">
 <input ref="input" type="file" accept=".gpx" name="" id="" multiple class="hidden absolute inset-0 z-50 w-screen h-screen opacity-0" @input="dropped">

 <nav class="flex relative justify-between h-10" :class="{'opacity-30 pointer-events-none': !hasLS, 'drop-shadow-2xl shadow-geo-400 !bg-black': pretahuje}">
    <Nastaveni :open="settingsOpen != -1" :ma-treti-sekci="vsechnySekce.length == 3" @pridat-sekci="pridatSekci" />

    <div class="flex gap-1 mr-6 h-full">
        <button @click="input?.click()" class="flex relative gap-2 items-center pl-4 ml-2 font-bold navButton" v-if="!selectMode">
            <PridatIkona class="scale-75" />
            <span class="max-sm:hidden">Přidat kešky</span>
        </button>
        <button @click="selectMode = !selectMode" class="flex relative gap-2 items-center pl-4 font-bold navButton" :class="{'ml-2': selectMode}">
            <VybratIkona class="scale-75" v-if="!selectMode" />
            <PotvrditIkona class="scale-75" v-else stroke="black" />
            <span class="max-sm:hidden" v-if="!selectMode">Vybrat</span>
            <span class="max-sm:hidden" v-else>Zpět</span>
        </button>
    </div>
    <div class="flex mr-6 h-full" v-if="!selectMode">
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="importBackup?.click()">
            <ImportIkona class="scale-75" />
            <span class="max-sm:hidden">Import</span>
        </button>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="exportData">
            <ExportIkona class="scale-75" />
            <span class="max-sm:hidden">Export</span>
        </button>
        <button class="flex relative items-center pl-4 font-bold navButton" @click="openDropdown(2)"><NastaveniIkona class="scale-75 stroke-black" /></button>
        <button class="flex relative items-center pl-4 font-bold navButton" @click="helpOpen = !helpOpen"><NapovedaIkona class="scale-75" /></button>
    </div>
    <div class="flex gap-1 mr-6 h-full" v-else>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="removeSelectedCaches(selectedCaches)">
            <SmazatIkona class="scale-75" stroke="black"/>
            <span class="max-sm:hidden">Smazat</span>
        </button>
        <button class="relative font-bold">
            <div class="flex gap-2 items-center pr-1 pl-2 navButton" @click="openDropdown(0)">
                <MoveIkona class="scale-75" />
                <span class="max-sm:hidden">Přesunout</span>
            </div>

            <!-- Dropdown -->
            <div class="flex absolute right-0 top-10 z-40 flex-col w-48 font-normal bg-geo-300" v-show="moveDropdownOpen > 0" ref="moveDropdownElement">
                <button v-for="(sekce, sInd) in vsechnySekce" class="px-1 py-2 text-left border-b-2 border-opacity-50 border-b-black hover:bg-black hover:bg-opacity-20" @click="moveSelectedCaches(sInd)">{{ sekce.jmeno }}</button>
            </div>
        </button>
        <button class="flex relative gap-2 items-center pr-1 pl-2 font-bold navButton" @click="moveSelectedToTop">
            <NavrchIkona class="scale-75" />
            <span class="max-sm:hidden">Na vrch</span>
        </button>
    </div>
 </nav>

 <div class="flex gap-5 justify-center mt-3" v-if="hasLS">
     <div class="w-96 h-[60rem] max-h-[70vh] px-3" v-for="(sekce, indexSekce) in vsechnySekce" v-show="smallScreen == -1 ? true : indexSekce == smallScreen" :key="sekce.barva" @dragover="draggingOverSection = indexSekce">

        <!-- Jméno sekce -->
        <div :style="{background: sekce.barva}" @click="editaceJmena = indexSekce" class="flex justify-between items-center text-xl font-extrabold text-white cursor-pointer group">
           <div class="flex w-full">
                <button class="ml-2" @click.stop="smallScreen = (smallScreen + 1) % (vsechnySekce.length)" v-if="editaceJmena == -1 && smallScreen != -1"><MoveIkona /></button>
                <form @submit.prevent="zmenitSekci" class="flex w-full h-max" v-if="editaceJmena == indexSekce">
                    <input type="text" maxlength="15" autocomplete="off" autofocus class="p-1.5 w-full bg-black bg-opacity-30 outline-none grow" v-model="sekce.jmeno">
                    <button type="submit" class="w-12 min-h-full bg-black bg-opacity-40">
                        <PotvrditIkona class="mx-auto scale-75" stroke="white" />
                    </button>
                    <button @click="smazatSekci(indexSekce)" type="button" class="w-12 min-h-full bg-black bg-opacity-40" v-if="vsechnySekce.length > 2">
                        <SmazatIkona class="mx-auto scale-75" stroke="white" />
                    </button>
                </form>
                <h2 class="p-1.5 text-white" :class="{'!text-black': shouldBeDark(sekce)}" v-else>{{ sekce.jmeno }}</h2>
           </div>

           <EditIkona v-if="editaceJmena != indexSekce" class="mr-2 w-5 h-5 opacity-0 transition-opacity group-hover:opacity-100" :class="{'invert': shouldBeDark(sekce)}" />
        </div>
        
        <section @dragover.prevent="hoverWithFiles(indexSekce)" @dragleave="draggingWithFile = -1" @drop.prevent="dragDropFiles" :class="{'cursor-copy': draggingWithFile == indexSekce}" class="flex overflow-y-auto relative flex-col w-full h-full bg-geo-300" :style="{accentColor: sekce.barva, scrollbarColor: `${sekce.barva} var(--normal)`}">
            <!-- Hledani -->
            <form class="w-full sticky top-0 z-10 grid grid-cols-[max-content_1fr_max-content] box-border" :style="{background: sekce.barva}" @submit.prevent="hledatKesky($event, indexSekce)" v-if="filtrZobrazen == indexSekce">
                <button type="button" :class="{'invert': !shouldBeDark(sekce)}" class="scale-50" @click="filtrZobrazen = -1; hledatKesky(-1, indexSekce)">
                    <ZavritIkona :stroke="shouldBeDark(sekce) ? 'black' : 'white'" />
                </button>
                <input type="text" @keyup.esc="filtrZobrazen = -1; hledatKesky(-1, indexSekce)" placeholder="Hledat..." autocomplete="off" autofocus autocorrect="off" class="px-0.5 m-1 text-sm text-white bg-black bg-opacity-30 placeholder:text-white">
                <!-- <button type="submit" class="scale-75">
                    <HledatIkona :stroke="shouldBeDark(sekce) ? 'black' : 'white'" />
                </button> -->
            </form>

            <!-- Barvy -->
            <div class="flex sticky top-0 z-10 pb-2 w-full h-8 bg-black bg-opacity-10" :style="{background: sekce.barva}" v-else-if="editaceJmena == indexSekce">
                <button v-for="barva in barvyKesek" class="box-border p-0.5 w-full h-6 border-black scale-75 -skew-x-12 drop-shadow-sharp" @click="sekce.barva = barva" :class="{'border-4': sekce.barva == barva}" :style="{background: barva}"></button>
            </div>

            <!-- Toolbar -->
            <div class="flex sticky top-0 bottom-1 z-10 justify-around text-white" :class="{'!text-black': shouldBeDark(sekce)}" :style="{background: sekce.barva}" v-else>
                <button class="flex relative gap-1 justify-center items-center font-bold hover:bg-black hover:bg-opacity-30 grow" @click="openDropdown(1, indexSekce)">
                    <RazeniIkona class="scale-75" :stroke="shouldBeDark(sekce) ? 'black' : 'white'"/>
                    <span>Řazení</span>
                    <button v-if="razeniAktivni == indexSekce" @click.stop="zrusitDocasnySort" class="absolute right-0" >
                        <ZavritIkona :class="{'invert': !shouldBeDark(sekce)}" class="scale-50" />
                    </button>
                </button>
                <button class="flex gap-1 justify-center items-center font-bold grow hover:bg-black hover:bg-opacity-30" @click="filtrZobrazen = indexSekce; zrusitDocasnySort()">
                    <HledatIkona class="scale-75" :stroke="shouldBeDark(sekce) ? 'black' : 'white'" />
                    <span>Hledat</span>
                </button>
            </div>

            <!-- Řazeni dropdown -->
            <div class="fixed z-10 py-1 mt-8 w-48 text-left drop-shadow-sharp bg-geo-300" v-if="sortDropdownOpen == indexSekce" @mouseup.capture.stop="">
                <h3 class="px-2 py-2 border-b-2 border-opacity-40 border-b-black">Řadit podle...</h3>
                <div class="flex flex-col w-full">
                    <div v-for="(razeni, rInd) in zpusobyRazeni" class="flex w-full hover:bg-opacity-40 odd:bg-black odd:bg-opacity-10 even:bg-black even:bg-opacity-20" :class="{'!bg-geo-400': rInd == vybraneRazeni}">
                        <input type="checkbox" class="pl-4 w-full text-left align-middle opacity-0" @click="vybraneRazeni = rInd; openDropdown(1, indexSekce)" :id="razeni.nazev">
                        <label :for="razeni.nazev" class="cursor-pointer grow">{{ razeni.nazev }}</label>
                    </div>
                </div>
                <div class="flex flex-col gap-3 justify-center px-6 mt-5 mb-4">
                    <button class="p-1 border-2 border-black" @click="sortCaches(true, indexSekce)" >Seřadit natrvalo</button>
                    <button class="p-1 border-2 border-black" @click="sortCaches(false, indexSekce)">Seřadit dočasně</button>
                </div>
            </div>

            <!-- Napoveda -->
            <div class="flex absolute top-1/2 left-1/2 flex-col items-center w-max text-center opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none" v-if="!vsechnyKesky[indexSekce].length && draggingWithFile != indexSekce">
                <NicIkona />
                <h3 class="text-xl font-medium">Nic tu není...</h3>
                <p>Přetáhněte sem nějaké kešky</p>
            </div>

            <!-- Upustit -->
            <div class="flex absolute top-1/2 left-1/2 flex-col items-center w-max text-center opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none" v-if="!vsechnyKesky[indexSekce].length && draggingWithFile == indexSekce">
                <SouboryIkona />
                <h3 class="text-xl font-medium">Upusťte soubory</h3>
                <p>Přidají se do této sekce</p>
            </div>

            <Keska
                v-for="(keska, ind) in vsechnyKesky[indexSekce]"
                v-bind="keska"
                ref="test"
                :index="ind"
                :select-mode="selectMode"
                :compact-mode="Boolean(nastaveniNastenky.zobrazeni)"
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
