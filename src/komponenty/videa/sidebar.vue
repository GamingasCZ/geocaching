<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Poznamka from './poznamka.vue';
import { hasLocalStorage } from '@/parserKesek';
import NicIkona from "@/ikony/nic.svg"

const notes = ref([])
onMounted(() => {
    if (hasLocalStorage())
        notes.value = JSON.parse(localStorage.getItem("poznamky")!) ?? []
})

</script>

<template>
    <aside class="min-w-[18rem] max-sm:w-full max-sm:h-60 max-sm:mb-8 max-h-[80svh] relative sm:sticky sm:top-4 underlineThick">
        <header>{{ $t('video.notes') }}</header>
        <div class="box-border flex overflow-auto relative flex-col gap-2 items-center p-2 w-full h-full bg-geo-200">

            <div class="flex absolute top-1/2 left-1/2 flex-col items-center w-max text-center opacity-60 invert -translate-x-1/2 -translate-y-1/2" v-if="notes.length == 0">
                <NicIkona />
                <h2 class="text-lg font-medium">{{ $t('video.noNotes') }}</h2>
                <p>{{ $t('video.help') }}</p>
            </div>

            <Poznamka v-for="note in notes" :nazev="note[0]" :text="note[1]" :cas="note[2]" :url="note[3]" :cas-precizni="note[4]"/>            
        </div>
    </aside>
</template>