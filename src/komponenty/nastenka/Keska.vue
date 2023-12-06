<script setup lang="ts">
import type { IntKeska } from '@/parserKesek';
import { ref } from 'vue';
import MapaIkona from "@/ikony/mapa.svg"
import OdkazIkona from "@/ikony/odkaz.svg"
import SmazatIkona from "@/ikony/smazat.svg"


interface Extra {
    index: number;
    selectMode: boolean;
    currentlyDragging: boolean;
}

const props = defineProps<IntKeska & Extra>()

const emit = defineEmits<{
    (e: "removeCache", index: number): void;
    (e: "showOnMap", index: number): void;
    (e: "startedDragging"): void;
    (e: "endedDragging"): void;
}>()

const smazatKesku = () => emit('removeCache', props.index)
const otevritNaGC = () => window.open(props.url)
const otevritNaMape = () => emit('showOnMap', props.index)



const moznosti = [
    {
        jmeno: "Zobrazit na mapě",
        ikona: MapaIkona,
        akce: otevritNaMape
    },
    {
        jmeno: "Zobrazit na Geocaching.com",
        ikona: OdkazIkona,
        akce: otevritNaGC
    },
    {
        jmeno: "Smazat",
        ikona: SmazatIkona,
        akce: smazatKesku
    },
]

const dragging = () => {
    emit("startedDragging")
}
const draggedOverDragger = ref(false)
const moveCache = (e: DragEvent) => {
    console.log(e)
    if (draggedOverDragger.value) {
    }
    emit('endedDragging')
}

</script>

<template>
    <div class="flex flex-col">
        <hr v-if="currentlyDragging" class="mx-4 h-2 border-none" :class="{'bg-blue-100': !draggedOverDragger, 'bg-blue-800': draggedOverDragger}" @dragover="draggedOverDragger = true" @dragleave="draggedOverDragger = false">
        <section class="p-1 m-1 bg-white border-l-4" :style="{borderColor: barva}" @dragstart="emit('startedDragging')" @dragend="moveCache" draggable="true" :data-index="index">
            <input type="checkbox" name="" id=""  class="" v-if="selectMode">
            <h2 class="inline text-lg font-bold">{{ jmeno }}</h2>
            <ul class="flex gap-4 pl-4 text-sm opacity-60">
              <li>{{ druh.slice(0,1).toUpperCase() + druh.slice(1) }}</li>  
              <li>D{{ obtiznost }}</li>  
              <li>T{{ teren }}</li>  
            </ul>
            <div class="flex justify-around w-full">
                <button v-for="moznost in moznosti" class="scale-75" :title="moznost.jmeno" @click="moznost.akce">
                    <component :is="moznost.ikona" :style="{stroke: barva, fill: barva}" />
                </button>
            </div>
        </section>
    </div>

</template>

<style>
li {
    @apply relative;
}
li::before {
    @apply content-[""] top-1/2 -translate-y-1/2 -left-2 rounded-full w-1 h-1 bg-black absolute
}
</style>