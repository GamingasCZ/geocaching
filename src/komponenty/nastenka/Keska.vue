<script setup lang="ts">
import type { IntKeska } from '@/parserKesek';
import { computed, ref, nextTick } from 'vue';
import MapaIkona from "@/ikony/mapa.svg"
import OdkazIkona from "@/ikony/odkaz.svg"
import SmazatIkona from "@/ikony/smazat.svg"
import ViceIkona from "@/ikony/more.svg"

interface Extra {
    index: number;
    selectMode: boolean;
    disableChildDragover: boolean;
    compactMode: boolean;
}

const props = defineProps<IntKeska & Extra>()

const emit = defineEmits<{
    (e: "removeCache", index: number): void;
    (e: "showOnMap", index: number): void;
    (e: "startedDragging", ind: number): void;
    (e: "endedDragging"): void;
    (e: "leftDragArea"): void;
    (e: "draggedOverCard", prop: {ind: number, draggingOverTop: boolean}): void
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

const moveCache = (e: DragEvent) => {
    // console.log(e)
    compactUnrolled.value = false
    emit('endedDragging')
}

const draggedOverCard = async (e: DragEvent) => {
    emit("draggedOverCard", {ind: props.index, draggingOverTop: e.offsetY / (e.target as HTMLDivElement).offsetHeight < 0.5})
}

const compactUnrolled = ref(false)

const compact = computed(() => !props.compactMode || compactUnrolled.value)

</script>

<template>
    <section class="m-1 bg-white shadow-md group" @click="compactUnrolled = !compactUnrolled" :class="{'border-l-4': compact, 'border-l-8 cursor-pointer': compactMode}" :style="{borderColor: barva}" @dragexit="emit('leftDragArea')" @dragstart="emit('startedDragging', index)" @dragend="moveCache" draggable="true" :data-index="index" @dragover="draggedOverCard">
        <div :class="{'pointer-events-none': disableChildDragover}">
            <div class="p-1">
                <input type="checkbox" name="" id=""  class="" v-if="selectMode">
                <h2 class="flex justify-between text-lg font-bold"><span>{{ jmeno }}</span><ViceIkona class="opacity-0 transition-opacity scale-50 group-hover:opacity-100" :class="{'rotate-180': compactUnrolled}" /></h2>
                <ul class="flex gap-4 pl-4 text-sm opacity-60" v-if="compact">
                    <li>{{ druh.slice(0,1).toUpperCase() + druh.slice(1) }}</li>  
                    <li>D{{ obtiznost }}</li>  
                    <li>T{{ teren }}</li>  
                </ul>
            </div>
            <div class="flex relative justify-around w-full pozadi" v-if="compact">
                <button v-for="moznost in moznosti" class="isolate scale-75" :title="moznost.jmeno" @click="moznost.akce">
                    <component :is="moznost.ikona" :style="{stroke: barva, fill: barva}" />
                </button>
            </div>
        </div>
    </section>

</template>

<style scoped>
.pozadi::before {
    background-color: v-bind(barva);
    @apply content-[''] absolute inset-0 w-full h-full opacity-10
}

</style>

<style>
li {
    @apply relative;
}
li::before {
    @apply content-[""] top-1/2 -translate-y-1/2 -left-2 rounded-full w-1 h-1 bg-black absolute
}
</style>