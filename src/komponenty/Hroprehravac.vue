<script setup lang="ts">
import hry from '@/assety/hry';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';


const hraIndex = computed(() => {
    let param = useRouter().currentRoute.value.params.hra
    return hry.findIndex(x => x.url == param)
})

const pr = ref(import.meta.env.BASE_URL)
</script>

<template>
    <main class="mx-auto">
        <iframe class="w-[1280px] border-4 border-geo-400 aspect-video" :src="`${pr}/${hry[hraIndex].url}/index.html`"></iframe>
        <nav class="flex relative justify-between mt-8 w-full h-10">
            <h2 class="px-6 text-2xl font-bold">{{ hry[hraIndex].nazev }}</h2>
        </nav>
    </main>
    <section class="flex flex-col gap-5 px-2 mt-8 ml-1 w-full">
        <Sekce nadpis="Ovládání" v-if="hry[hraIndex].popis" :text="hry[hraIndex].popis" />
        <Sekce nadpis="Popis" v-if="hry[hraIndex].popis" :text="hry[hraIndex].popis" />
    </section>
</template>
