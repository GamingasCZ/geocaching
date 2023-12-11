<script setup lang="ts">

import NekompaktniIkona from "@/ikony/nekompaktni.svg"
import KompaktniIkona from "@/ikony/kompaktni.svg"
import { Nastaveni } from "./nastaveniNastenky";


defineProps<{
    open: boolean
}>()

</script>

<template>
    <section class="flex absolute right-5 top-10 z-40 flex-col bg-geo-300" v-if="open">
        <div class="flex gap-4 justify-between items-center p-2 mr-2 border-b-2 border-black">
            <label>Zobrazení</label>
            <div class="flex gap-4">
                <button :class="{'bg-geo-400': Nastaveni.zobrazeni == 0}" @click="Nastaveni.zobrazeni = 0" class="p-0.5 border border-black scale-150"><NekompaktniIkona /></button>
                <button :class="{'bg-geo-400': Nastaveni.zobrazeni == 1}" @click="Nastaveni.zobrazeni = 1" class="p-0.5 border border-black scale-150"><KompaktniIkona /></button>
            </div>
        </div>
        <div class="flex gap-4 justify-between p-2 border-b-2 border-black">
            <label>Obnovovat polohu kešek</label>
            <select v-model="Nastaveni.obnovovani">
                <option :value="0">Každých 5s</option>
                <option :value="1">Každých 10s</option>
                <option :value="2">Každých 30s</option>
                <option :value="3">Každých 60s</option>
                <option :value="4">Nikdy</option>
            </select>
        </div>
        <div class="flex gap-4 justify-between p-2 border-b-2 border-black">
            <label>Zakázat přetahování</label>
            <input type="checkbox" name="" id="" v-model="Nastaveni.zakazatPretahovani">
        </div>
    </section>
</template>