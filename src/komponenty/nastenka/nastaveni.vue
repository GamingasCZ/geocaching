<script setup lang="ts">

import NekompaktniIkona from "@/ikony/nekompaktni.svg"
import KompaktniIkona from "@/ikony/kompaktni.svg"
import PridatIkona from "@/ikony/plus.svg"
import { Nastaveni } from "./nastaveniNastenky";


defineProps<{
    open: boolean
    maTretiSekci: boolean
}>()

const emit = defineEmits<{
    (e: "pridatSekci"): void
}>()

</script>

<template>
    <section class="flex absolute right-5 top-10 z-40 flex-col justify-start bg-geo-300" v-if="open" @mouseup.capture.stop="">
        <div class="flex gap-4 justify-between items-center p-2 mr-2 border-b-2 border-black">
            <label>Zobrazení</label>
            <div class="flex gap-4">
                <button :class="{'bg-geo-400': Nastaveni.zobrazeni == 0}" @click="Nastaveni.zobrazeni = 0" class="p-0.5 border border-black scale-150"><NekompaktniIkona /></button>
                <button :class="{'bg-geo-400': Nastaveni.zobrazeni == 1}" @click="Nastaveni.zobrazeni = 1" class="p-0.5 border border-black scale-150"><KompaktniIkona /></button>
            </div>
        </div>
        <div class="flex gap-4 justify-between items-center p-2 mr-0.5 border-b-2 border-black">
            <label>Sekce</label>
            <button @click="emit('pridatSekci')" :disabled="maTretiSekci" class="flex items-center pr-2 border border-black hover:bg-black hover:bg-opacity-20 disabled:pointer-events-none disabled:opacity-50"><PridatIkona class="-m-0.5 scale-50" />Přidat</button>
        </div>
        <div class="flex gap-4 justify-between items-center p-2 border-b-2 border-black">
            <label>Zakázat polohu v nástěnce</label>
            <input type="checkbox" name="" id="" v-model="Nastaveni.zakazatPolohu">
        </div>
        <div class="flex gap-4 justify-between p-2 border-b-2 border-black">
            <label>Zakázat přetahování</label>
            <input type="checkbox" name="" id="" v-model="Nastaveni.zakazatPretahovani">
        </div>
    </section>
</template>