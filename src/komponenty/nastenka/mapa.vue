<script setup lang="ts">
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { onMounted, ref, watch } from 'vue';

import NapovedaIkona from "@/ikony/zarovka.svg"
import ViceIkona from "@/ikony/more.svg"
import MapaIkona from "@/ikony/mapa.svg"
import ZavritIkona from "@/ikony/zavrit.svg"
import OdkazIkona from "@/ikony/odkaz.svg"
import KompasIkona from "@/ikony/kompas.svg"
import { fromLonLat } from "ol/proj";
import Vzdalenost from "node-geo-distance";

const props = defineProps<{
    jmeno: string;
    napoveda: string;
    pozice: {latitude: number, longtitude: number}
    open: boolean;
}>()

const map = ref()

onMounted(() => {
    let m = new Map({
      target: map.value,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([49.2162547, 16.6034506]),
        zoom: 2,
        enableRotation: false
      }),
    });
})



const dialog = ref<HTMLDialogElement>()
watch(props, () => {
    dialog.value?.showModal()
    ziskatPozici()
})

const close = () => {
    dialog.value?.close()
}
dialog.value?.addEventListener("close", close)

const napovedaShown = ref(false)

const vzdalMetry = ref("0m")
const azimut = ref(0)
const azimutRadian = ref(0)
function ziskatPozici() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((nyniPozice) => {
            let nyniPoloha = {latitude: nyniPozice.coords.latitude, longitude: nyniPozice.coords.longitude}
            let polohaKesky = {latitude: props.pozice.latitude, longitude: props.pozice.longtitude}
            let vzdalenost = parseFloat(Vzdalenost.vincentySync(nyniPoloha, polohaKesky))

            let a = Math.log( Math.tan( polohaKesky.latitude / 2 + Math.PI / 4 ) / Math.tan( nyniPoloha.latitude / 2 + Math.PI / 4) )
            let b = Math.abs( nyniPoloha.longitude - nyniPoloha.longitude )
            let az = Math.atan2(a, b)
            azimutRadian.value = az+Math.PI/2
            azimut.value = az*180.0/Math.PI

            switch (true) {
                case vzdalenost >= 1000:
                    vzdalMetry.value = `${(vzdalenost/1000).toFixed(1)}km`; break;
                case vzdalenost >= 100:
                    vzdalMetry.value = `${vzdalenost.toFixed(0)}km`; break;
                case vzdalenost >= 10:
                    vzdalMetry.value = `${vzdalenost.toFixed(1)}km`; break;
                case vzdalenost < 10:
                    vzdalMetry.value = `${vzdalenost.toFixed(2)}km`; break;
                default:
                    break;
            }

        }, (chyba) => {
            console.log("kurva")
        })
    }
}

</script>

<template>
    <dialog ref="dialog" class="backdrop:bg-black backdrop:bg-opacity-80">
        <section class="grid grid-cols-[1fr_17rem] bg-geo-400 w-[90rem] max-w-full h-[45rem] max-h-screen">
            <!-- Mapa -->
            <div ref="map" class="relative h-full border-4 border-r-0 skewButton border-geo-400">
                <div class="absolute top-0 -right-3 w-16 h-full bg-gradient-to-l to-transparent -z-10 from-geo-400"></div>
            </div>
    
            <!-- Ovládání -->
            <div class="flex flex-col items-center">
                <KompasIkona class="my-4 scale-75" :style="{transform: `rotate(${azimutRadian}rad)`}" />
                <h2 class="text-xl font-bold">{{ jmeno }}</h2>
                <h3 class="text-xl font-bold">{{ vzdalMetry+azimut }}°</h3>
                <div class="flex flex-col gap-3">
                    <div>
                        <button @click="napovedaShown = !napovedaShown" class="flex gap-2 items-center w-full hover:bg-black hover:bg-opacity-30"><NapovedaIkona stroke="black" class="scale-75" />Nápověda<ViceIkona class="ml-auto scale-50" :class="{'rotate-180': napovedaShown}" /></button>
                        <p v-if="napovedaShown" class="p-1 w-full text-sm bg-black bg-opacity-20">{{ napoveda }}</p>
                    </div>
                    <button class="flex gap-2 items-center hover:bg-black hover:bg-opacity-30"><MapaIkona stroke="black" class="scale-75" />Body trasy<ViceIkona class="ml-auto scale-50" /></button>
                    <div class="py-3"></div>
                    <button class="flex gap-2 items-center hover:bg-black hover:bg-opacity-30"><OdkazIkona stroke="black" class="scale-75" />Zobrazit na Geocaching.com</button>
                    <button class="flex gap-2 items-center hover:bg-black hover:bg-opacity-30"><OdkazIkona stroke="black" class="scale-75" />Zobrazit na Mapách.cz</button>
                    <button class="flex gap-2 items-center hover:bg-black hover:bg-opacity-30"><OdkazIkona stroke="black" class="scale-75" />Zobrazit na Google Mapách</button>
                    <div class="py-3"></div>
                    <button class="flex gap-2 items-center hover:bg-black hover:bg-opacity-30" @click="close"><ZavritIkona stroke="black" class="scale-75" />Zavřít</button>
                </div>
            </div>
        </section>
    </dialog>
</template>

<style>
.ol-zoom {
    @apply flex flex-col gap-2 p-3 drop-shadow-sharp float-right z-50 right-2 absolute;
}

.ol-zoom > * {
    @apply !bg-geo-400 aspect-square w-9 text-3xl font-black;
}

.ol-rotate { @apply hidden; }
.ol-attribution > button { @apply hidden; }
.ol-attribution { @apply absolute bottom-1 left-1 }

</style>