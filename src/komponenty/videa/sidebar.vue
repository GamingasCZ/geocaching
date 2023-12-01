<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Poznamka from './poznamka.vue';
import { hasLocalStorage } from '@/parserKesek';

const notes = ref([])
onMounted(() => {
    if (hasLocalStorage())
        notes.value = JSON.parse(localStorage.getItem("poznamky")!) ?? []
})

</script>

<template>
    <aside class="w-72 max-h-[80svh] sticky top-16 underlineThick">
        <header>Poznámky</header>
        <ul class="box-border flex flex-col gap-2 items-center p-2 w-full h-full bg-geo-200">
            <Poznamka v-for="note in notes" :nazev="note[0]" :text="note[1]" :cas="note[2]" :url="note[3]" />            
        </ul>
    </aside>
</template>