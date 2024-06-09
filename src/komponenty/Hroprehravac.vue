<script setup lang="ts">
import hry from '@/assety/hry';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Sekce from "@/komponenty/ostatni/textovaSekce.vue";

const hraIndex = computed(() => {
    let param = useRouter().currentRoute.value.params.hra
    return hry.value.findIndex(x => x.url == param)
})

const hra = ref<HTMLIFrameElement>()
onMounted(() => {
    hra.value?.addEventListener("load", () => {
        hra.value.contentDocument.querySelector("canvas").style.maxWidth = "100vw"
        hra.value.contentDocument.querySelector("canvas").style.maxHeight = "100vh"
    })
})


const pr = ref("https://gamingas.cz")
</script>

<template>
    <main class="mx-auto w-screen max-w-[92rem] mt-4">
        <div ref="hra" class="flex justify-center items-center mx-auto w-full max-w-5xl text-2xl text-white bg-black border-4 border-geo-400 aspect-video">
            <h2>{{ $t('game.soonNG') }}</h2>
        </div>
        <nav class="flex relative justify-between mt-8 w-full h-10 after:-skew-x-12">
            <h2 class="px-6 text-2xl font-bold">{{ hry[hraIndex].nazev }}</h2>
        </nav>
        <section class="flex flex-col gap-5 px-2 my-8 ml-1 w-full">
            <Sekce :nadpis="$t('game.controls')" :text="hry[hraIndex].ovladani" />
        </section>
    </main>
</template>