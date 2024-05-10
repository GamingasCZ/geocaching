<script setup lang="ts">
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { inject, ref, watch, onUnmounted } from 'vue';

import BodTrasy from './bodTrasy.vue';
import PridatIkona from "@/ikony/plus.svg"
import NapovedaIkona from "@/ikony/zarovka.svg"
import ViceIkona from "@/ikony/more.svg"
import MapaIkona from "@/ikony/mapa.svg"
import ZavritIkona from "@/ikony/zavrit.svg"
import OdkazIkona from "@/ikony/odkaz.svg"
import PlayIkona from "@/ikony/play.svg"
import KompasIkona from "@/ikony/kompas.svg"
import PolohaIkona from "@/ikony/poloha.svg"
import { fromLonLat, toLonLat, transform } from "ol/proj";
import Vzdalenost from "node-geo-distance";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { parseDistance, type IntKeska, type Waypoint } from '@/parserKesek';
import type { StyleLike } from 'ol/style/Style';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import bodTrasy from "@/ikony/bodTrasy.svg?url"
import bodPolohy from "@/ikony/bodPolohy.svg?url"
import Icon from 'ol/style/Icon';


const emit = defineEmits<{
    (e: "zavrit"): void
}>()

const props = defineProps<{
    jmeno: string;
    napoveda: string;
    pozice: { latitude: number, longtitude: number }
    open: boolean;
    geokod: string;
    waypointy: Waypoint[];
    objekt: IntKeska;
}>()

const ulozitKesky = inject<() => void>("ulozitKesky")!
const map = ref()

const ikonaBoduTrasy = new Style({
  image: new Icon({
    anchor: [0.5, 16],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: bodTrasy,
  }),
});
const ikonaPolohy = new Style({
  image: new Icon({
    anchor: [0.5, 16],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: bodPolohy,
  }),
});

function mapGoto(lon: number, lat: number) {
    let myView = new View({
        center: transform(fromLonLat([lon, lat], 'EPSG:3857'), m.getView().getProjection(), m.getView().getProjection()), zoom: 18,
        projection: 'EPSG:3857'
    });
    m.setView(myView);
}

let m: Map;
let VecLayer = new VectorLayer({
    source: new VectorSource({
        features: []
    }),
})
const spawnMapy = () => {
    if (m != undefined) return
    m = new Map({
        target: map.value,
        view: new View({projection: 'EPSG:3857'}),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            VecLayer
        ],
    });

    addPointToMap(props.pozice.longtitude, props.pozice.latitude, 0, "X")
    let j = 1
    props.waypointy.forEach(wp => {
        addPointToMap(wp.longitude, wp.latitude, j, j.toString())
        j += 1
    })
    mapGoto(props.pozice.longtitude, props.pozice.latitude)
    ziskatPozici()

    m.addEventListener("click", e => {
        if (pickingWaypoint.value) {
            klikPoloha.value = toLonLat(m.getCoordinateFromPixel(e.pixel))
            pickingWaypoint.value = false
        }
    })
}

const klikPoloha = ref(null)
const addPointToMap = (lon: number, lat: number, id: number = 0, addText?: string, jinyStyl?: StyleLike) => {
    let point = new Point(fromLonLat([lon, lat]))
    let bod = new Feature(point)
    bod.setId(id)
    if (jinyStyl) bod.setStyle(jinyStyl)
    else {
        let iconClone
        if (addText != "Poloha") {
            iconClone = ikonaBoduTrasy.clone()
            iconClone.setText(new Text({text: addText, offsetY: 0,font: 'bold 16px sans-serif'}))
        }
        else {
            iconClone = ikonaPolohy.clone()
        }
        bod.setStyle(iconClone)
    }
    VecLayer.getSource()!.addFeature(bod)
    return [point, bod]
}

const dialog = ref<HTMLDialogElement>()
watch(props, () => {
    dialog.value?.showModal()
    spawnMapy()
})

const close = () => {
    dialog.value?.close()
    VecLayer.getSource()?.getFeatures().forEach((feat) => {
        feat.dispose()
    })
    emit('zavrit')
}
dialog.value?.addEventListener("close", close)

const napovedaShown = ref(false)
const mapFullscreen = ref(false)

const polohaPlusMinus = ref(0)
const vzdalMetry = ref("0m")
const azimut = ref("0")
const azimutRadian = ref("0")
const nyniPoloha = ref({ latitude: 0, longitude: 0 })
const polohaZakazana = ref(false)

watch(nyniPoloha, () => {
    if (nyniPoloha.value.latitude == 0)
        addPointToMap(nyniPoloha.value.longitude, nyniPoloha.value.latitude, -1, "Poloha")
    else {
        removeWaypoint(null, "-1")
        addPointToMap(nyniPoloha.value.longitude, nyniPoloha.value.latitude, -1, "Poloha")
    }
}, {deep: true})

const nacitaniPolohy = ref(false)
function ziskatPozici() {
    if ("geolocation" in navigator) {
        nacitaniPolohy.value = true
        navigator.geolocation.getCurrentPosition((nyniPozice) => {
            polohaPlusMinus.value = nyniPozice.coords.accuracy
            nyniPoloha.value = { latitude: nyniPozice.coords.latitude, longitude: nyniPozice.coords.longitude }
            
            let polohaKesky = { latitude: props.pozice.latitude, longitude: props.pozice.longtitude }
            let vzdalenost = parseFloat(Vzdalenost.vincentySync(nyniPoloha.value, polohaKesky))
            let az = Math.atan((nyniPoloha.value.longitude - polohaKesky.longitude) / (nyniPoloha.value.latitude - polohaKesky.latitude));
            let a = az + Math.PI / 2
            if (a < 0) a += 2 * Math.PI
            let b = az * 180.0 / Math.PI
            if (b < 0) b += 360

            azimutRadian.value = (a).toFixed(0);
            azimut.value = (b).toFixed(0);
            vzdalMetry.value = parseDistance(vzdalenost)
            nacitaniPolohy.value = false
        }, (chyba) => {
            polohaZakazana.value = true
            nacitaniPolohy.value = false
        }, { enableHighAccuracy: true, timeout: 30000 })
    }
}

const bodyTrasyShown = ref(false)

const vsechnyKesky = inject<IntKeska[][]>("vsechnyKesky")
const workingOnWaypoint = ref(false)
const pickingWaypoint = ref(false)
const addWaypoint = () => {
    props.objekt.waypointy.splice(0, 0, { jmeno: "", latitude: 0, longitude: 0, editing: true })
    workingOnWaypoint.value = true
}
const saveWaypoint = (data: Waypoint) => {
    props.objekt.waypointy.splice(0, 1)
    props.objekt.waypointy.push(data)
    addPointToMap(data.longitude, data.latitude, props.objekt.waypointy.length, props.objekt.waypointy.length.toString())
    workingOnWaypoint.value = false
    ulozitKesky()
}
const removeWaypoint = (ind: number | null, id?: string) => {
    if (!id && ind != null) id = (ind + 1).toString()
    if (ind != null) props.objekt.waypointy.splice(ind, 1)
    VecLayer.getSource()?.removeFeature(VecLayer.getSource()?.getFeatureById(id)!)
    ulozitKesky()
}

const sledovaniPolohy = ref(false)
var sledovaniID = -1
const toggleSledovaniPolohy = () => {
    sledovaniPolohy.value = !sledovaniPolohy.value
    if (sledovaniPolohy.value) {
        sledovaniID = navigator.geolocation.watchPosition((nyniPozice) => {
            polohaPlusMinus.value = nyniPozice.coords.accuracy
            nyniPoloha.value = { latitude: nyniPozice.coords.latitude, longitude: nyniPozice.coords.longitude }
            let polohaKesky = { latitude: props.pozice.latitude, longitude: props.pozice.longtitude }
            let vzdalenost = parseFloat(Vzdalenost.vincentySync(nyniPoloha.value, polohaKesky))
            let az = Math.atan((nyniPoloha.value.longitude - polohaKesky.longitude) / (nyniPoloha.value.latitude - polohaKesky.latitude));
            let a = az + Math.PI / 2
            if (a < 0) a += 2 * Math.PI
            let b = az * 180.0 / Math.PI
            if (b < 0) b += 360
    
            azimutRadian.value = (a).toFixed(0);
            azimut.value = (b).toFixed(0);
            vzdalMetry.value = parseDistance(vzdalenost)
        }, () => {return}, {enableHighAccuracy: true})
    }
    else {
        navigator.geolocation.clearWatch(sledovaniID)
    }
}

onUnmounted(() => {
    if (sledovaniPolohy.value) {
        navigator.geolocation.clearWatch(sledovaniID)
        sledovaniID = -1
    }
})

</script>

<template>
    <dialog ref="dialog" class="backdrop:bg-black backdrop:bg-opacity-80">
        <section
            class="grid sm:grid-cols-[1fr_17rem] bg-geo-400 w-[90rem] max-w-full max-h-[45rem] h-[90vh] overflow-y-auto relative"
            :class="{ 'max-sm:grid-rows-[10rem_1fr]': !mapFullscreen, 'flex': mapFullscreen }">
            <!-- Mapa -->
            <div ref="map" :class="{'cursor-crosshair': pickingWaypoint}" class="relative h-full border-4 border-r-0 border-geo-400 skewButton">
                <button
                    class="absolute top-1/2 left-1/2 z-10 p-2 text-lg font-medium border-2 border-black -translate-x-1/2 -translate-y-1/2 sm:hidden"
                    v-if="!mapFullscreen" @click="mapFullscreen = true">Zobrazit mapu</button>
                <div class="absolute top-2 left-2 !p-1 w-max bg-geo-400 ol-zoom" v-if="mapFullscreen">
                    <button @click="mapFullscreen = false" class="flex justify-center items-center w-max -scale-x-100"><PlayIkona /></button>
                </div>

                <Transition>
                    <div v-if="pickingWaypoint" class="flex absolute top-0 left-1/2 gap-3 items-center p-1 pt-2 font-bold bg-gradient-to-b to-transparent backdrop-blur-sm -translate-x-1/2 from-geo-400">
                        <span>Klikni do mapy pro vybrání bodu.</span>
                        <button @click="pickingWaypoint = false" class="px-3 py-1 border-2 border-black">Zrušit</button>
                    </div>
                </Transition>
            </div>

            <!-- Ovládání -->
            <div class="flex max-sm:mt-40 bg-geo-400 absolute flex-col items-center w-[17rem] right-0 overflow-auto h-full max-sm:w-full"
                v-if="!mapFullscreen">
                <KompasIkona class="overflow-visible my-4 scale-75" :style="{ transform: `rotate(${azimut}deg)` }" />
                <h2 class="text-xl font-bold text-center">{{ jmeno }}</h2>
                <h3 class="flex justify-around my-2 w-full text-xl font-bold" v-if="!polohaZakazana && !nacitaniPolohy">
                    <span>{{ vzdalMetry }}</span>
                    <span>{{ azimut }}°</span>
                </h3>
                <div v-if="!polohaZakazana && nacitaniPolohy" class="py-2 my-2 w-1/2 h-8 bg-black bg-opacity-40 rounded-md">
                </div>
                <div class="flex flex-col w-full h-full">
                    <div>
                        <button @click="toggleSledovaniPolohy()"
                            class="flex gap-2 items-center px-1 py-2 w-full disabled:pointer-events-none disabled:opacity-30 hover:bg-black hover:bg-opacity-30">
                            <PolohaIkona stroke="black" class="scale-75" />Živá poloha
                            <input v-model="sledovaniPolohy" type="checkbox" class="mr-1.5 ml-auto shadow-sm shadow-black">
                        </button>
                    </div>
                    <div>
                        <button @click="napovedaShown = !napovedaShown" :class="{ 'bg-black bg-opacity-20': napovedaShown }"
                            :disabled="!napoveda"
                            class="flex gap-2 items-center px-1 py-2 w-full disabled:pointer-events-none disabled:opacity-30 hover:bg-black hover:bg-opacity-30">
                            <NapovedaIkona stroke="black" class="scale-75" />Nápověda
                            <ViceIkona class="ml-auto scale-50" v-if="napoveda" :class="{ 'rotate-180': napovedaShown }" />
                        </button>
                        <p v-if="napovedaShown && napoveda" class="p-1 w-full text-sm bg-black bg-opacity-20">{{ napoveda }}
                        </p>
                    </div>
                    <div>
                        <button @click="bodyTrasyShown = !bodyTrasyShown"
                            :class="{ 'bg-black bg-opacity-20': bodyTrasyShown }"
                            class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30">
                            <MapaIkona stroke="black" class="scale-75" />Body trasy
                            <ViceIkona class="ml-auto scale-50" :class="{ 'rotate-180': bodyTrasyShown }" />
                        </button>
                        <div v-if="bodyTrasyShown"
                            class="flex flex-col gap-2 px-4 py-1 w-full text-sm bg-black bg-opacity-20">
                            <button @click="addWaypoint" :disabled="workingOnWaypoint"
                                class="flex gap-2 items-center pr-2 pl-1 mx-auto w-max font-medium border-2 border-black hover:bg-black hover:bg-opacity-20 disabled:pointer-events-none disabled:opacity-40">
                                <PridatIkona class="scale-75" />Přidat
                            </button>
                            <BodTrasy jmeno="Výchozí" :latitude="props.pozice.latitude" :longitude="props.pozice.longtitude"
                                :def="true" @go-to-point="mapGoto($event.lon, $event.lat)" />
                            <BodTrasy v-for="(wpt, index) in waypointy" v-bind="wpt" :ind="index" :keska="objekt" :klik-poloha="klikPoloha"
                                @cancel="objekt.waypointy.splice(index, 1); workingOnWaypoint = false" @picking-point="pickingWaypoint = true"
                                @save="saveWaypoint"
                                @go-to-point="mapGoto($event.lon, $event.lat)" @remove-point="removeWaypoint" />
                        </div>
                    </div>
                    <div class="py-3"></div>
                    <a :href="`https://www.geocaching.com/geocache/${geokod}`" target="_blank">
                        <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30">
                            <OdkazIkona stroke="black" class="scale-75" />Zobrazit na Geocaching.com
                        </button>
                    </a>
                    <a :href="`https://mapy.cz/zakladni?source=coor&id=${pozice.longtitude}%2C${pozice.latitude}&x=${pozice.longtitude}&y=${pozice.latitude}&z=16`"
                        target="_blank">
                        <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30">
                            <OdkazIkona stroke="black" class="scale-75" />Zobrazit na Mapách.cz
                        </button>
                    </a>
                    <a :href="`https://www.google.com/maps/search/?api=1&query=${pozice.latitude}%2C${pozice.longtitude}`"
                        target="_blank">
                    <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30">
                        <OdkazIkona stroke="black" class="scale-75" />Zobrazit na Google Mapách
                    </button>
                </a>
                <div class="grow"></div>
                <button class="flex gap-2 items-center px-1 py-1.5 w-full hover:bg-black hover:bg-opacity-30"
                    @click="close">
                    <ZavritIkona stroke="black" class="scale-75" />Zavřít
                </button>
            </div>
        </div>
    </section>
</dialog></template>

<style>.ol-zoom {
    @apply flex flex-col gap-2 p-3 drop-shadow-sharp float-right z-50 right-2 absolute;
}

.ol-zoom>* {
    @apply !bg-geo-400 aspect-square w-9 text-3xl font-black;
}

.ol-rotate {
    @apply hidden;
}

.ol-attribution>button {
    @apply hidden;
}

.ol-attribution {
    @apply absolute bottom-1 left-1
}</style>
