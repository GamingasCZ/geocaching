<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import Sekce from "@/komponenty/ostatni/textovaSekce.vue";
import Videa from "@/assety/videa"

import { useRouter } from 'vue-router';

const router = useRouter()
const videoIndex = computed(() => {
    let param = router.currentRoute.value.params.video
    return Videa.findIndex(x => x.url == param)
})

const thumbPredVideo = ref("")
const thumbTotoVideo = ref("")
const thumbDalsiVideo = ref("")
const getVideo = async () => {
    if (videoIndex.value > 0)
        thumbPredVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value - 1].url}-min.webp`).then(res => res.default)
    if (videoIndex.value < Videa.length - 1)
        thumbDalsiVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value + 1].url}-min.webp`).then(res => res.default)
    thumbTotoVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value].url}-max.webp`).then(res => res.default)
}
watch(videoIndex, async () => {
        await getVideo()
    })
getVideo()

</script>

<template>
    <main class="mx-auto w-full">
        <div class="relative max-w-[60rem] aspect-video mx-auto border-geo-400 border-4">
            <iframe class="w-full h-full" :src="`https://www.youtube-nocookie.com/embed/${Videa[videoIndex].link}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>

        <nav class="flex relative justify-between items-center mt-8 w-full h-10 after:-skew-x-12 max-sm:flex-col">
            <h2 class="px-6 text-2xl font-bold">{{ Videa[videoIndex].nazev }}</h2>
        </nav>

        <section class="flex flex-wrap gap-y-4 justify-between pr-6 mt-2 ml-3 w-full max-sm:mt-16">
            <RouterLink class="vOdkaz grid text-white grid-cols-[max-content_1fr] w-full max-w-lg bg-geo-50 relative overflow-clip border-4 border-white" :to="Videa[videoIndex - 1].url" v-if="videoIndex > 0">
                <img :src="thumbPredVideo" class="w-44 z-10 max-w-[30vw]" :alt="Videa[videoIndex - 1].nazev">
                <img :src="thumbPredVideo" class="absolute w-full h-full blur-xl brightness-50" :alt="Videa[videoIndex - 1].nazev">
                <div class="flex isolate flex-col p-2">
                    <h2 class="mb-5 text-xl font-extrabold">{{ $t('video.prev') }}</h2>
                    <span>{{ Videa[videoIndex - 1].nazev }}</span>
                </div>
            </RouterLink>
            <div v-else></div>

            <RouterLink class="vOdkaz grid text-white grid-cols-[max-content_1fr] ml-auto w-full max-w-lg bg-geo-50 relative overflow-clip border-4 border-white" :to="Videa[videoIndex + 1].url" v-if="videoIndex < Videa.length - 1">
                <img :src="thumbDalsiVideo" class="w-44 z-10 max-w-[30vw]" :alt="Videa[videoIndex + 1].nazev">
                <img :src="thumbDalsiVideo" class="absolute w-full h-full blur-xl brightness-50" :alt="Videa[videoIndex + 1].nazev">
                <div class="flex isolate flex-col p-2">
                    <h2 class="mb-5 text-xl font-extrabold">{{ $t('video.next') }}</h2>
                    <span>{{ Videa[videoIndex + 1].nazev }}</span>
                </div>
            </RouterLink>
        </section>

        <section class="flex flex-col gap-5 px-2 my-8 ml-1 w-full">
            <Sekce :nadpis="$t('video.desc')" v-if="Videa[videoIndex].popis" :text="Videa[videoIndex].popis" />
            <Sekce :nadpis="$t('video.sources')" v-if="Videa[videoIndex].zdroje" :text="Videa[videoIndex].zdroje" />
        </section>
    </main>
</template>