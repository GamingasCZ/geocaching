<script setup lang="ts">
import type { IntKeska } from '@/parserKesek';


defineProps<IntKeska>()

const moznosti = [
    {
        jmeno: "Zobrazit na mapě",
        ikona: "",
        akce: ""
    },
    {
        jmeno: "Zobrazit na Geocaching.com",
        ikona: "",
        akce: ""
    },
    {
        jmeno: "Smazat",
        ikona: "",
        akce: ""
    },
]

</script>

<template>
<section class="p-1 m-1 bg-white border-l-4" :style="{borderColor: barva}">
    <h2>{{ jmeno }}</h2>
    <div class="flex space-between">
        <button v-for="moznost in moznosti" :title="moznost.ikona">
            <img class="w-8" :src="moznost.ikona">
        </button>
    </div>
</section>

</template>
