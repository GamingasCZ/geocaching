<script setup lang="ts">
import { reactive, ref } from 'vue';
import { XMLParser } from "fast-xml-parser";

const pretahuje = ref(false)

async function dropped(e: Event) {
    let text = await input.value?.files?.[0].text()
    let parser = new XMLParser()
    let parsedCache = parser.parse(text)

    cacheData.jmeno = parsedCache.gpx.wpt['groundspeak:cache']['groundspeak:name']
    cacheData.od = parsedCache.gpx.wpt['groundspeak:cache']['groundspeak:owner']
    cacheData.kod = parsedCache.gpx.wpt.name

    pretahuje.value = false
}

const cacheData = reactive({
    jmeno: '',
    od: '',
    kod: ''
})

const input = ref<HTMLInputElement>()

</script>

<template>
<main>
 <div class="relative p-1 m-4 w-96 rounded-lg border-2 border-dashed border-geo-400 text-geo-400 file:bg-red-300" :class="{'bg-geo-300': pretahuje}">
     <p>Přetáhněte, nebo vyberte .gpx soubor</p>
     <input ref="input" type="file" name="" id="" class="absolute top-0 w-full h-full opacity-0" @dragover="pretahuje=true" @dragleave="pretahuje=false" @input="dropped">
 </div>
 <a href="https://gamingas.wz.cz/GC1J7JG.gpx" target="_blank" class="text-blue-400" download>Soubor</a>
 <ul class="text-white">
    <li>Jméno kešky: {{ cacheData.jmeno }}</li>
    <li>Položil: {{ cacheData.od }}</li>
    <li>Kód: {{ cacheData.kod }}</li>
 </ul>
</main>

</template>