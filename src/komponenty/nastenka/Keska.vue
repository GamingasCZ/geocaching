<script setup lang="ts">

defineProps<{
    jmeno: string
    kod: string
    druh: number
    barva: string
}>()

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
<section class="bg-white p-1 m-1 border-l-4" :style="{borderColor: barva}">
    <h2>{{ jmeno }}</h2>
    <div class="flex space-between">
        <button v-for="moznost in moznosti" :title="moznost.ikona">
            <img class="w-8" :src="moznost.ikona">
        </button>
    </div>
</section>

</template>
