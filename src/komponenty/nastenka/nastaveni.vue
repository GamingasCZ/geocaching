<script setup lang="ts">

import NekompaktniIkona from "@/ikony/nekompaktni.svg"
import KompaktniIkona from "@/ikony/kompaktni.svg"

defineProps<{
    open: boolean
}>()

</script>

<template>
    <section class="flex absolute right-5 top-10 z-40 flex-col bg-geo-300" v-if="open">
        <div class="flex gap-4 justify-between items-center p-2 border-b-2 border-black">
            <label>Zobrazení</label>
            <div class="flex gap-4">
                <button class="p-0.5 border border-black scale-150"><NekompaktniIkona /></button>
                <button class="p-0.5 border border-black scale-150"><KompaktniIkona /></button>
            </div>
        </div>
        <div class="flex gap-4 justify-between p-2 border-b-2 border-black">
            <label>Obnovovat polohu kešek</label>
            <select>
                <option>Každých 5s</option>
                <option>Každých 10s</option>
                <option>Každých 30s</option>
                <option>Každých 60s</option>
                <option>Nikdy</option>
            </select>
        </div>
        <div class="flex gap-4 justify-between p-2 border-b-2 border-black">
            <label>Zakázat přetahování</label>
            <input type="checkbox" name="" id="">
        </div>
    </section>
</template>