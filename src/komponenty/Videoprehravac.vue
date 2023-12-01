<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Sekce from "@/komponenty/ostatni/textovaSekce.vue";
import Videa from "@/assety/videa"

import Fullscreen from "@/ikony/fullscreen.svg"
import Play from "@/ikony/play.svg"
import Pause from "@/ikony/pause.svg"
import EditIkona from "@/ikony/edit.svg"
import { useRouter } from 'vue-router';
import EditorPoznamky from './videa/editorPoznamky.vue';
import { hasLocalStorage } from '@/parserKesek';

const video = ref<HTMLVideoElement>()

const videoIndex = computed(() => {
    let param = useRouter().currentRoute.value.params.video
    return Videa.findIndex(x => x.url == param)
})

const thumbPredVideo = ref("")
const thumbTotoVideo = ref("")
const thumbDalsiVideo = ref("")
const videoLink = ref()
const getVideo = async () => {
    videoLink.value = await import(`@/videa/${Videa[videoIndex.value].url}.webm`).then(res => res.default)
    if (videoIndex.value > 0)
        thumbPredVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value - 1].url}-min.webp`).then(res => res.default)
    if (videoIndex.value < Videa.length - 1)
        thumbDalsiVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value + 1].url}-min.webp`).then(res => res.default)
    thumbTotoVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value].url}-max.webp`).then(res => res.default)
}
getVideo()

const videoStarted = ref(false)
const playbackTime = ref(0)
const parsedDuration = ref("0:00")
const parsedElapsedTime = ref("0:00")
onMounted(() => {
    video.value?.addEventListener("timeupdate", () => {
        parsedDuration.value = parseTime(video.value?.duration)
        playbackTime.value = video.value?.currentTime / video.value?.duration
        parsedElapsedTime.value = parseTime(video.value?.currentTime)
    })
    video.value?.addEventListener("ended", () => {
        isPlaying.value = false
    })
    document.addEventListener("fullscreenchange", e => {
        console.log(document.fullscreenElement)
    })

    watch(videoIndex, () => {
        videoStarted.value = false
    })

    if (hasLocalStorage()) {
        NOTES.value = JSON.parse(localStorage.getItem("poznamky")!) ?? []
    }
})

const parseTime = (secs: number) => {
    let minutes = Math.floor(secs/60).toString().padStart(2, "0")
    let seconds = Math.floor(secs % 60).toString().padStart(2, "0")
    if (isNaN(minutes) || isNaN(seconds)) return "00:00"
    return `${minutes}:${seconds}`
}

const isFullscreened = ref(false)
const isPlaying = ref(false)

const playpauseVideo = () => {
    if (!videoStarted.value) videoStarted.value = true
    
    if (video.value?.paused)
        video.value?.play()
    else
        video.value?.pause()
    isPlaying.value = !video.value?.paused
}

const fullscreen = () => {
    isFullscreened.value = !isFullscreened.value
    if (isFullscreened.value)
        document.documentElement?.requestFullscreen()
    else
        document.exitFullscreen()
}

const controlsVisible = ref(false)

let hideControlsCooldown = -1
const controlsHover = () => {
    controlsVisible.value = true
    if (hideControlsCooldown != -1) clearTimeout(hideControlsCooldown)

    if (!isPlaying.value) return
    hideControlsCooldown = setTimeout(() => {
        controlsVisible.value = false
    }, 2000)
}

const notePanelShown = ref(false)
const noteTimestamp = ref("0:00")
const showNotePanel = () => {
    video.value?.pause()
    isPlaying.value = false
    controlsHover()
    noteTimestamp.value = parsedElapsedTime.value

    notePanelShown.value = true
}

const NOTES = ref([])
const noteSaved = (allNotes: any[]) => {
    notePanelShown.value = false
    NOTES.value = allNotes
}
</script>

<template>
    <main class="mx-auto">
        <div class="relative max-w-[60rem] px-2 mx-auto">
            <Teleport to="html" :disabled="!isFullscreened">
                <video
                    ref="video"
                    :key="videoIndex"
                    :poster="thumbTotoVideo"
                    @click="playpauseVideo"
                    @keyup.space="playpauseVideo"
                    @dblclick="fullscreen"
                    @contextmenu.prevent=""
                    class="bg-black w-[60rem]"
                    :class="{'!w-full top-0 left-0 h-full absolute z-40': isFullscreened}"
                    :src="videoLink"
                    @mousemove="controlsHover"
                ></video>

                <!-- Kliknutím přehrát -->
                <button @click="playpauseVideo" v-if="!videoStarted" class="flex absolute scale-[2.2] hover:scale-[2] transition-transform p-3 top-1/2 left-1/2 justify-center items-center bg-black bg-opacity-50 -translate-x-1/2 -translate-y-1/2 rounded-full">
                    <Play fill="white" />
                </button>

                <!-- Ovládání videa -->
                <div 
                    class="flex absolute bottom-0 gap-4 justify-between items-center p-1 w-full bg-opacity-40 bg-gradient-to-t from-black to-transparent"
                    :class="{'z-50': isFullscreened}"
                    v-if="controlsVisible"
                    v-show="videoStarted"
                >
                    <button @click="playpauseVideo" class="p-1 w-8 h-8 bg-white">
                        <Pause v-if="isPlaying" class="w-8 h-8"  />
                        <Play v-else="isPlaying" class="w-8 h-8"  />
                    </button>
                    <div class="flex flex-col w-full grow">
                        <progress :value="playbackTime" class="w-full h-3 transition-transform -skew-x-12 bg-geo-400 hover:scale-y-125"></progress>
                        <span class="text-xs text-white">{{ parsedElapsedTime }} / {{ parsedDuration }}</span>
                    </div>
                    <button @click="fullscreen" class="p-1 w-8 h-8 bg-white">
                        <Fullscreen class="w-8 h-8"  />
                    </button>
                </div>

            </Teleport>
        </div>
        <nav class="flex relative justify-between items-center mt-8 h-10">
            <h2 class="px-6 text-2xl font-bold">{{ Videa[videoIndex].nazev }}</h2>
            <button class="flex gap-2 items-center px-2 mr-3 h-full font-bold text-white -skew-x-12 bg-ext-fia" @click="showNotePanel">
                <EditIkona class="w-6 h-6 skew-x-12" />
                <span class="skew-x-12">Zapsat poznámku</span>
            </button>
        </nav>
        <EditorPoznamky @cancel="notePanelShown = false" @saved="noteSaved" v-if="notePanelShown" :curr-url="Videa[videoIndex].url" :time="noteTimestamp" :max-time="parsedDuration" />

        <section class="flex flex-wrap justify-between pr-6 mt-2 ml-3 w-full">
            <RouterLink class="grid grid-cols-[max-content_1fr] p-2 w-full max-w-lg bg-white" :to="Videa[videoIndex - 1].url" v-if="videoIndex > 0">
                <img :src="thumbPredVideo" class="w-44" :alt="Videa[videoIndex - 1].nazev">
                <div class="flex flex-col p-2">
                    <h2 class="mb-5 text-xl font-extrabold">Předchozí video</h2>
                    <span>{{ Videa[videoIndex - 1].nazev }}</span>
                </div>
            </RouterLink>
            <div v-else></div>

            <RouterLink class="grid grid-cols-[max-content_1fr] p-2 w-full max-w-lg bg-white" :to="Videa[videoIndex + 1].url" v-if="videoIndex < Videa.length - 1">
                <img :src="thumbDalsiVideo" class="w-44" :alt="Videa[videoIndex + 1].nazev">
                <div class="flex flex-col p-2">
                    <h2 class="mb-5 text-xl font-extrabold">Další video</h2>
                    <span>{{ Videa[videoIndex + 1].nazev }}</span>
                </div>
            </RouterLink>
        </section>

        <section class="flex flex-col gap-5 px-2 mt-8 ml-1">
            <Sekce nadpis="Poznámky" v-if="Videa[videoIndex].popis" :text="Videa[videoIndex].popis" />
            <Sekce nadpis="Popis" v-if="Videa[videoIndex].popis" :text="Videa[videoIndex].popis" />
            <Sekce nadpis="Zdroje" v-if="Videa[videoIndex].zdroje" :text="Videa[videoIndex].zdroje" />
        </section>
    </main>
</template>