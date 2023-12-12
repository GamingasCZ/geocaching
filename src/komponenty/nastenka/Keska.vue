<script setup lang="ts">
import type { IntKeska } from '@/parserKesek';
import { computed, ref, nextTick, watch, provide } from 'vue';
import MapaIkona from "@/ikony/mapa.svg"
import OdkazIkona from "@/ikony/odkaz.svg"
import SmazatIkona from "@/ikony/smazat.svg"
import ViceIkona from "@/ikony/more.svg"
import { Nastaveni } from './nastaveniNastenky';

interface Extra {
    index: number;
    selectMode: boolean;
    disableChildDragover: boolean;
    compactMode: boolean;
}

const props = defineProps<IntKeska & Extra>()

const selected = ref(false)
const select = (isHoldingShift: boolean = false) => {
    if (!isHoldingShift) selected.value = !selected.value
    emit('modifySelections', {index: props.index, shiftSelection: isHoldingShift})
}
defineExpose({
    select
})

const emit = defineEmits<{
    (e: "removeCache", index: number): void;
    (e: "modifySelections", prop: {index: number, shiftSelection: boolean}): void;
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

const clickCard = (e: MouseEvent) => {
    if (e.ctrlKey) select()
    else if (e.shiftKey) select()
    else {
        if (props.selectMode) select()
        else if (props.compactMode) compactUnrolled.value = !compactUnrolled.value
    }

}

watch(props, () => {
    if (!props.selectMode) selected.value = false
})

</script>

<template>
    <section class="m-1 bg-white drop-shadow-sharp group" @click="clickCard" :class="{'border-l-4': compact, 'border-l-8 cursor-pointer': compactMode}" :style="{borderColor: barva}" @dragexit="emit('leftDragArea')" @dragstart="emit('startedDragging', index)" @dragend="moveCache" :draggable="!Nastaveni.zakazatPretahovani && !selectMode" :data-index="index" @dragover="draggedOverCard">
        <div :class="{'pointer-events-none': disableChildDragover && !Nastaveni.zakazatPretahovani}">
            <div class="relative p-1" :class="{'pozadi': selected}">
                <h2 class="flex relative justify-between items-center text-lg font-bold">
                    <div>
                        <input type="checkbox" name="" id=""  class="mr-1 align-middle" v-if="selectMode" v-model="selected" @click.stop="select">
                        <span class="isolate align-middle">{{ jmeno }}</span>
                    </div>
                    <ViceIkona class="opacity-0 transition-opacity scale-50 group-hover:opacity-100" v-if="Nastaveni.zobrazeni == 1" :class="{'rotate-180': compactUnrolled}" />
                </h2>
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
    @apply content-[''] absolute inset-0 w-full h-full opacity-20
}

</style>

<style>
li {
    @apply relative;
}
li::before {
    @apply content-[""] top-1/2 -translate-y-1/2 -left-2 rounded-full w-1 h-1 bg-black absolute
}

input[type='checkbox'] {
    @apply bg-geo-50 relative appearance-none w-5 h-5 border-geo-400 border-2
}
input[type='checkbox']:checked::after {
    @apply content-[''] absolute bg-geo-400 w-3 h-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
}
select {
    @apply bg-geo-50 !text-white  border-geo-400 border-2;
}
</style>