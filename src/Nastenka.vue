<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { hasLocalStorage, handleDrop, refreshList } from './parserKesek'
import type { IntKeska } from './parserKesek'
import Keska from './komponenty/nastenka/Keska.vue'

const pretahuje = ref(false)
const neplatnaKeskaPopup = ref(false)

const vsechnyKesky = ref<Keska[]>([])
const vsechnySekce = ref<Sekce[]>([])

const input = ref<HTMLInputElement>()
const hasLS = hasLocalStorage()

onMounted(() => {
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
})

async function dropped(e: Event) {
    let text = await input.value?.files?.[0].text()
    
    let parsed = handleDrop(text)
    if (!parsed) {
        neplatnaKeska.value = true
        setTimeout(() => neplatnaKeska.value = false, 1000)
    }
    
    pretahuje.value = false
    [vsechnyKesky.value, vsechnySekce.value] = refreshList()
}
</script>

<template>
<main>
 <div class="relative p-1 m-4 w-96 rounded-lg border-2 border-dashed border-geo-400 text-geo-400 file:bg-red-300" :class="{'bg-geo-300': pretahuje}">
     <p>Přetáhněte, nebo vyberte .gpx soubor</p>
     <input ref="input" type="file" accept=".gpx" name="" id="" class="absolute top-0 w-full h-full opacity-0" @dragover="pretahuje=true" @dragleave="pretahuje=false" @input="dropped">
 </div>
<!--
 <a href="https://gamingas.wz.cz/GC1J7JG.gpx" target="_blank" class="text-blue-400" download>Soubor</a>
-->
 <!-- To pak přepni!! -->
 <p v-if="!hasLS" class="bg-geo-400 w-max fixed left-1/2 -translate-x-1/2 text-xl p-2 top-20">Nemáš zaplé místní úložiště/cookies!</p>
 <p v-if="neplatnaKeska">Některé kešky se nepodařilo načíst!</p>
 <!--
 <ul class="text-white">
    <li>Jméno kešky: {{ cacheData.jmeno }}</li>
    <li>Položil: {{ cacheData.zakladatel }}</li>
    <li>Kód: {{ cacheData.kod }}</li>
 </ul>
 -->
 <div class="flex justify-between">
     <div class="w-96 h-[30rem] max-h-[30vw]" v-for="sekce in vsechnySekce">
         <h2 :style="{background: sekce.barva}" class="text-white">{{ sekce.jmeno }}</h2>
         <section class="bg-gray-500 w-full h-full">
            <Keska v-for="(keska) in vsechnyKesky" v-bind="keska" />
         </section> 
     </div>
 </div>
</main>

</template>
