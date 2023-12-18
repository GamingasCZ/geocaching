<script setup lang="ts">
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { onMounted, ref, watch } from 'vue';

import BodTrasy from './bodTrasy.vue';
import PridatIkona from "@/ikony/plus.svg"
import NapovedaIkona from "@/ikony/zarovka.svg"
import ViceIkona from "@/ikony/more.svg"
import MapaIkona from "@/ikony/mapa.svg"
import ZavritIkona from "@/ikony/zavrit.svg"
import OdkazIkona from "@/ikony/odkaz.svg"
import KompasIkona from "@/ikony/kompas.svg"
import { fromLonLat, transform } from "ol/proj";
import Vzdalenost from "node-geo-distance";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import { parseDistance, type Waypoint } from '@/parserKesek';
import type { FeatureObject } from 'ol/format/Feature';

const props = defineProps<{
    jmeno: string;
    napoveda: string;
    pozice: {latitude: number, longtitude: number}
    open: boolean;
    geokod: string;
    waypointy: Waypoint[];
}>()

const map = ref()

function mapGoto(lon: number, lat: number) {
    let myView = new View({
        center: transform(fromLonLat([lon, lat], 'EPSG:3857'), m.getView().getProjection(), m.getView().getProjection()), zoom: 16 });
    m.setView(myView);
}


let m;
let VecLayer = new VectorLayer({
    source: new VectorSource({
        features: []
    }),
    style: {
        "circle-radius": 9,
        "circle-fill-color": getComputedStyle(document.documentElement).getPropertyValue('--svetly'),
        "circle-stroke-color": 'black',
        "stroke-width": 3,
    }
})
const spawnMapy = () => {
    m = new Map({
      target: map.value,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        VecLayer
      ],
    });

    addPointToMap(props.pozice.longtitude, props.pozice.latitude)
    props.waypointy.forEach(wp => addPointToMap(wp.longitude, wp.latitude))
    mapGoto(props.pozice.longtitude, props.pozice.latitude)
}

const addPointToMap = (lon: number, lat: number) => {
    let bod = new Feature(new Point(fromLonLat([lon, lat])))
    VecLayer.getSource()?.addFeature(bod)
}

const dialog = ref<HTMLDialogElement>()
watch(props, () => {
    dialog.value?.showModal()
    spawnMapy()
    ziskatPozici()
})

const close = () => {
    dialog.value?.close()
    VecLayer.getSource()?.getFeatures().forEach((feat) => {
        feat.dispose()
    })
}
dialog.value?.addEventListener("close", close)

const napovedaShown = ref(false)
const mapFullscreen = ref(false)

const vzdalMetry = ref("0m")
const azimut = ref("0")
const azimutRadian = ref("0")
const nyniPoloha = ref({latitude: 0, longitude: 0})
const polohaZakazana = ref(false)

watch(nyniPoloha, () => {
    addPointToMap(nyniPoloha.value.longitude, nyniPoloha.value.latitude)
})

const nacitaniPolohy = ref(false)
function ziskatPozici() {
    if ("geolocation" in navigator) {
        nacitaniPolohy.value = true
        navigator.geolocation.getCurrentPosition((nyniPozice) => {
            nyniPoloha.value = {latitude: nyniPozice.coords.latitude, longitude: nyniPozice.coords.longitude}
            let polohaKesky = {latitude: props.pozice.latitude, longitude: props.pozice.longtitude}
            let vzdalenost = parseFloat(Vzdalenost.vincentySync(nyniPoloha.value, polohaKesky))
            let az = Math.atan((nyniPoloha.value.longitude-polohaKesky.longitude) / (nyniPoloha.value.latitude-polohaKesky.latitude));
            let a = az+Math.PI/2
            if (a < 0) a += 2*Math.PI
            let b = az*180.0/Math.PI
            if (b < 0) b += 360

            azimutRadian.value = (a).toFixed(0);
            azimut.value = (b).toFixed(0);
            vzdalMetry.value = parseDistance(vzdalenost)
            nacitaniPolohy.value = false
        }, (chyba) => {
            polohaZakazana.value = true
            nacitaniPolohy.value = false
        }, {enableHighAccuracy: true})
    }
}

const bodyTrasyShown = ref(false)
</script>

<template>
    <dialog ref="dialog" class="backdrop:bg-black backdrop:bg-opacity-80">
        <section class="grid sm:grid-cols-[1fr_17rem] bg-geo-400 w-[90rem] max-w-full h-[45rem] overflow-y-auto max-h-screen relative" :class="{'max-sm:grid-rows-[10rem_1fr]': !mapFullscreen, 'flex': mapFullscreen}">
            <!-- Mapa -->
            <div ref="map" class="relative h-full border-4 border-r-0 border-geo-400 skewButton">
                <button class="absolute top-1/2 left-1/2 z-10 p-2 text-lg font-medium border-2 border-black -translate-x-1/2 -translate-y-1/2 sm:hidden" v-if="!mapFullscreen" @click="mapFullscreen = true">Zobrazit mapu</button>
                <div class="absolute top-2 left-2 w-max bg-geo-400 ol-zoom" v-if="mapFullscreen">
                    <button @click="mapFullscreen = false" class="" >fs</button>
                </div>
            </div>
    
            <!-- Ovládání -->
            <div class="flex absolute flex-col items-center w-[17rem] right-0 overflow-auto h-full max-sm:w-full" v-if="!mapFullscreen">
                <KompasIkona class="overflow-visible my-4 scale-75" :style="{transform: `rotate(${azimut}deg)`}" />
                <h2 class="text-xl font-bold text-center">{{ jmeno }}</h2>
                <h3 class="flex justify-around my-2 w-full text-xl font-bold" v-if="!polohaZakazana">
                    <span>{{vzdalMetry}}</span>
                    <span>{{azimut}}°</span>
                </h3>
                <div v-if="!polohaZakazana && nacitaniPolohy" class="py-2 my-2 w-1/2 h-8 bg-black bg-opacity-40 rounded-md"></div>
                <div class="flex flex-col w-full h-full">
                    <div>
                        <button @click="napovedaShown = !napovedaShown" :class="{'bg-black bg-opacity-20': napovedaShown}" :disabled="!napoveda" class="flex gap-2 items-center px-1 py-2 w-full disabled:pointer-events-none disabled:opacity-30 hover:bg-black hover:bg-opacity-30"><NapovedaIkona stroke="black" class="scale-75" />Nápověda<ViceIkona class="ml-auto scale-50" v-if="napoveda" :class="{'rotate-180': napovedaShown}" /></button>
                        <p v-if="napovedaShown && napoveda" class="p-1 w-full text-sm bg-black bg-opacity-20">{{ napoveda }}</p>
                    </div>
                    <div>
                        <button @click="bodyTrasyShown = !bodyTrasyShown" :class="{'bg-black bg-opacity-20': bodyTrasyShown}" class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30"><MapaIkona stroke="black" class="scale-75" />Body trasy<ViceIkona class="ml-auto scale-50" :class="{'rotate-180': bodyTrasyShown}" /></button>
                        <div v-if="bodyTrasyShown" class="flex flex-col gap-2 px-4 py-1 w-full text-sm bg-black bg-opacity-20">
                            <button class="flex gap-2 items-center pr-2 pl-1 mx-auto w-max font-medium border-2 border-black hover:bg-black hover:bg-opacity-20"><PridatIkona class="scale-75" />Přidat</button>
                            <BodTrasy jmeno="Výchozí" :latitude="props.pozice.latitude" :longitude="props.pozice.longtitude" :def="true" @go-to-point="mapGoto($event.lon, $event.lat)" />
                            <BodTrasy v-for="wpt in waypointy" v-bind="wpt" @go-to-point="mapGoto($event.lon, $event.lat)" />
                        </div>
                    </div>
                    <div class="py-3"></div>
                    <a :href="`https://www.geocaching.com/geocache/${geokod}`" target="_blank">
                        <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30"><OdkazIkona stroke="black" class="scale-75" />Zobrazit na Geocaching.com</button>
                    </a>
                    <a :href="`https://mapy.cz/zakladni?source=coor&id=${pozice.longtitude}%2C${pozice.latitude}&x=${pozice.longtitude}&y=${pozice.latitude}&z=16`" target="_blank">
                        <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30"><OdkazIkona stroke="black" class="scale-75" />Zobrazit na Mapách.cz</button>
                    </a>
                    <a :href="`https://www.google.com/maps/search/?api=1&query=${pozice.latitude}%2C${pozice.longtitude}`" target="_blank">
                        <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30"><OdkazIkona stroke="black" class="scale-75" />Zobrazit na Google Mapách</button>
                    </a>
                    <div class="grow"></div>
                    <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30" @click="close"><ZavritIkona stroke="black" class="scale-75" />Zavřít</button>
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