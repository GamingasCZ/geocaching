<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import Sekce from "@/komponenty/ostatni/textovaSekce.vue";
import Videa from "@/assety/videa"

import Fullscreen from "@/ikony/fullscreen.svg"
import Play from "@/ikony/play.svg"
import Pause from "@/ikony/pause.svg"
import EditIkona from "@/ikony/edit.svg"
import { useRouter } from 'vue-router';
import EditorPoznamky from './videa/editorPoznamky.vue';
import { hasLocalStorage } from '@/parserKesek';
import summonNotif from './ostatni/summonNotif';
import PrehravacPoznamka from './videa/prehravacPoznamka.vue';

const video = ref<HTMLVideoElement>()

const router = useRouter()
const videoIndex = computed(() => {
    let param = router.currentRoute.value.params.video
    return Videa.findIndex(x => x.url == param)
})

const thumbPredVideo = ref("")
const thumbTotoVideo = ref("")
const thumbDalsiVideo = ref("")
const poznamkyProVideo = ref("")
const videoLink = ref()
const getVideo = async () => {
    videoLink.value = await import(`@/videa/${Videa[videoIndex.value].url}.webm`).then(res => res.default)
    if (videoIndex.value > 0)
        thumbPredVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value - 1].url}-min.webp`).then(res => res.default)
    if (videoIndex.value < Videa.length - 1)
        thumbDalsiVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value + 1].url}-min.webp`).then(res => res.default)
    thumbTotoVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value].url}-max.webp`).then(res => res.default)
    if (hasLocalStorage()) {
        let pozn = JSON.parse(localStorage.getItem("poznamky")!) ?? []
        poznamkyProVideo.value = pozn.filter(x => x[3] == Videa[videoIndex.value].url)
    }
}

const videoStarted = ref(false)
const playbackTime = ref(0)
const parsedDuration = ref("0:00")
const parsedElapsedTime = ref("0:00")
onMounted(() => {
    getVideo()
    video.value?.addEventListener("timeupdate", () => {
        parsedDuration.value = parseTime(video.value?.duration)
        playbackTime.value = video.value?.currentTime / video.value?.duration
        parsedElapsedTime.value = parseTime(video.value?.currentTime)
    })
    video.value?.addEventListener("ended", () => {
        isPlaying.value = false
    })
    video.value?.addEventListener("error", () => {
        summonNotif("Nepodařilo se načíst video!")
    })

    document.addEventListener("fullscreenchange", e => {
        if (e == null) {
            isFullscreened.value = false
            document.body.classList.remove("clip")
        }
    })

    watch(videoIndex, async () => {
        videoStarted.value = false
        await getVideo()
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
const videoRatio = ref(0)

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
    if (isFullscreened.value) {
        document.documentElement?.requestFullscreen()
        document.body.classList.add("clip")
    }
    else {
        document.body.classList.remove("clip")
        document.exitFullscreen()
    }
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
    videoRatio.value = video.value?.currentTime / video.value?.duration

    notePanelShown.value = true
}

const NOTES = ref([])
const noteSaved = (allNotes: any[]) => {
    notePanelShown.value = false
    NOTES.value = allNotes
    let pozn = JSON.parse(localStorage.getItem("poznamky")!) ?? []
    poznamkyProVideo.value = pozn.filter(x => x[3] == Videa[videoIndex.value].url)
}

const progressbar = ref<HTMLProgressElement>()
const pbarHovering = ref(false)
const pbarHelpLeftOffset = ref(0)
const progressbarTime = ref("0:00")
const changeHoverTime = (e: MouseEvent) => {
    pbarHovering.value = true
    let timeRatio = e.layerX/(e.target as HTMLProgressElement).clientWidth
    pbarHelpLeftOffset.value = Math.round(timeRatio*100)
    progressbarTime.value = parseTime(video.value?.duration! * timeRatio)
}
const scrubVideo = (click: MouseEvent) => {
    let skipToTime = click.layerX / click.target.clientWidth
    skocitNaCas(skipToTime)
}
const skocitNaCas = (podil: number) => {
    video.value.currentTime = Math.round(video.value?.duration! * podil)
}

const smazatPoznamku = (ratio: number) => {
    NOTES.value.splice(NOTES.value.findIndex(x => x[4] == ratio), 1)
    localStorage.setItem("poznamky", JSON.stringify(NOTES.value))
    poznamkyProVideo.value = NOTES.value.filter(x => x[3] == Videa[videoIndex.value].url)
}

provide("videoSkocitNaCas", skocitNaCas)
provide("smazatPoznamku", smazatPoznamku)


const changedNoteTime = () => videoRatio.value = video.value?.currentTime / video.value?.duration
const hoveringOverNote = ref(-1)

</script>

<template>
    <main class="mx-auto w-full">
        <div class="relative max-w-[60rem] mx-auto border-geo-400">
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
                    :class="{'!w-full top-0 left-0 h-full absolute z-40': isFullscreened, 'cursor-none': !controlsVisible}"
                    :src="videoLink"
                    @mousemove="controlsHover"
                ></video>

                <!-- Kliknutím přehrát -->
                <button @click="playpauseVideo" v-if="!videoStarted" class="flex absolute scale-[2.2] hover:scale-[2] transition-transform p-3 top-1/2 left-1/2 justify-center items-center bg-black bg-opacity-50 -translate-x-1/2 -translate-y-1/2 rounded-full">
                    <Play fill="white" />
                </button>

                <!-- Ovládání videa -->
                <div 
                    class="flex absolute bottom-0 gap-4 justify-between items-center p-2 pl-1 w-full bg-opacity-40 bg-gradient-to-t from-black to-transparent"
                    :class="{'z-50': isFullscreened}"
                    v-show="controlsVisible"
                    v-if="videoStarted"
                >
                    <button @click="playpauseVideo" class="w-8 h-8 bg-geo-400 drop-shadow-sharp">
                        <Pause v-if="isPlaying" class="scale-75"/>
                        <Play v-else="isPlaying" class="scale-75"  />
                    </button>
                    <div class="flex relative flex-col w-full grow">
                        <div v-if="pbarHovering" :style="{left: `${pbarHelpLeftOffset}%`}" class="absolute -top-6 px-2 w-max text-sm text-white bg-black bg-opacity-80 rounded-md -translate-x-1/2 pointer-events-none">{{ progressbarTime }}</div>
                        
                        <!-- Body poznámky na časové ose -->
                        <button v-for="(p, ind) in poznamkyProVideo" @mouseover="hoveringOverNote = ind" @mouseout="hoveringOverNote = -1" @click="skocitNaCas(p[4])" :style="{left: `${p[4]*100}%`}" class="absolute -top-1 z-10 w-2 h-3/4 -translate-x-1/2 -skew-x-12 bg-ext-fia"></button>
                        
                        <div v-if="hoveringOverNote > -1" :style="{left: `${poznamkyProVideo[hoveringOverNote][4]*100}%`}" class="absolute bottom-10 p-1 font-medium text-white bg-black bg-opacity-40 border-2 -translate-x-1/2 border-ext-fia">{{ poznamkyProVideo[hoveringOverNote][0] }}</div>


                        <progress
                            ref="progressbar"
                            @click="scrubVideo"
                            :value="playbackTime"
                            @mousemove="changeHoverTime"
                            @mouseleave="pbarHovering = false"
                            class="w-full h-3 transition-transform -skew-x-12 cursor-pointer hover:scale-y-125"
                        ></progress>
                        <span class="text-xs text-white pointer-events-none">{{ parsedElapsedTime }} / {{ parsedDuration }}</span>
                    </div>
                    <button @click="fullscreen" class="w-8 h-8 bg-geo-400 drop-shadow-sharp">
                        <Fullscreen class="scale-75"  />
                    </button>
                </div>

            </Teleport>
        </div>

        <nav class="flex relative justify-between items-center mt-8 w-full h-10 max-sm:flex-col">
            <h2 class="px-6 text-2xl font-bold">{{ Videa[videoIndex].nazev }}</h2>
            <button class="flex gap-2 items-center px-2 mr-3 h-full font-bold text-white -skew-x-12 max-sm:py-2 bg-ext-fia" @click="showNotePanel">
                <EditIkona class="w-6 h-6 skew-x-12" />
                <span class="skew-x-12">Zapsat poznámku</span>
            </button>
        </nav>
        <EditorPoznamky @cancel="notePanelShown = false" @changedNoteTime="changedNoteTime" @saved="noteSaved" v-if="notePanelShown" :time-ratio="videoRatio" :curr-url="Videa[videoIndex].url" :time="noteTimestamp" :max-time="parsedDuration" />

        <section class="flex flex-wrap gap-y-4 justify-between pr-6 mt-2 ml-3 w-full max-sm:mt-16">
            <RouterLink class="grid grid-cols-[max-content_1fr] p-2 w-full max-w-lg bg-white" :to="Videa[videoIndex - 1].url" v-if="videoIndex > 0">
                <img :src="thumbPredVideo" class="w-44 max-w-[30vw]" :alt="Videa[videoIndex - 1].nazev">
                <div class="flex flex-col p-2">
                    <h2 class="mb-5 text-xl font-extrabold">Předchozí video</h2>
                    <span>{{ Videa[videoIndex - 1].nazev }}</span>
                </div>
            </RouterLink>
            <div v-else></div>

            <RouterLink class="grid grid-cols-[max-content_1fr] ml-auto p-2 w-full max-w-lg bg-white" :to="Videa[videoIndex + 1].url" v-if="videoIndex < Videa.length - 1">
                <img :src="thumbDalsiVideo" class="w-44 max-w-[30vw]" :alt="Videa[videoIndex + 1].nazev">
                <div class="flex flex-col p-2">
                    <h2 class="mb-5 text-xl font-extrabold">Další video</h2>
                    <span>{{ Videa[videoIndex + 1].nazev }}</span>
                </div>
            </RouterLink>
        </section>

        <section class="flex flex-col gap-5 px-2 my-8 ml-1 w-full">
            <Sekce nadpis="Poznámky" v-if="poznamkyProVideo.length" :add-component="PrehravacPoznamka" :comp-props="{poznamky: poznamkyProVideo}" />
            <Sekce nadpis="Popis" v-if="Videa[videoIndex].popis" :text="Videa[videoIndex].popis" />
            <Sekce nadpis="Zdroje" v-if="Videa[videoIndex].zdroje" :text="Videa[videoIndex].zdroje" />
        </section>
    </main>
</template>