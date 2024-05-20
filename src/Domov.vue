<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue';
import pozadi from './obrazky/pozadi2.svg?url'
import pozadi2 from './obrazky/pozadi4.svg?url'
import pozadi3 from './obrazky/pozadi5.svg?url'
import pozadi6 from './obrazky/pozadi6.svg?url'
import audio from './bonusy/bonus0.ogg'
import audio1 from './bonusy/bonus1.ogg'
import audio2 from './bonusy/bonus2.ogg'
import audio3 from './bonusy/bonus3.ogg'
import audio4 from './bonusy/bonus4.ogg'
import audioTut from './bonusy/tut.ogg'
import scrollDown from './ikony/scrollDown.svg'
import Darek from './komponenty/Darek.vue';
import DarekPad from './komponenty/DarekPad.vue';
import Scrollbar from './komponenty/ostatni/Scrollbar.vue';
import BonusContainer from './komponenty/ostatni/bonusContainer.vue';

const STRANKY = 5

let dragY = 0
let dragYStart = -1
document.documentElement.ontouchmove = e => {
    if (dragYStart == -1) dragYStart = e.touches[0].clientY
    if (Math.abs(dragYStart - e.touches[0].clientY) > window.innerHeight / 5 && !isScrolling.value) {
        isScrolling.value = true
        setTimeout(() => isScrolling.value = false, 250);

        if (dragYStart - e.touches[0].clientY < 0) currScroll.value = Math.max(0, currScroll.value - 1)
        else currScroll.value = Math.min(currScroll.value + 1, STRANKY - 1)

        reposition(true)
        dragYStart = -1
        dragY = 0
    }
}
document.documentElement.ontouchend = () => { dragYStart = -1; dragY = 0 }

window.onresize = () => reposition(false)

const isScrolling = ref(false)
const currScroll = ref(0)
provide("currScroll", currScroll)
document.documentElement.onwheel = e => {
    e.preventDefault()
    if (e.ctrlKey) return
    if (!isScrolling.value) {
        isScrolling.value = true
        setTimeout(() => isScrolling.value = false, 250);

        if (e.deltaY < 0) currScroll.value = Math.max(0, currScroll.value - 1)
        else currScroll.value = Math.min(currScroll.value + 1, STRANKY - 1)

        reposition(true)
    }
}

const reposition = (smooth = false) => {
    window.scrollTo({ top: document.documentElement.clientHeight * currScroll.value, behavior: smooth ? 'smooth' : 'instant' })
}

onMounted(() => {
    document.body.style.overflowY = "hidden"
})
onUnmounted(() => {
    document.body.style.overflowY = "auto"
    document.documentElement.onwheel = null
    document.documentElement.ontouchmove = null
    window.onresize = null
})

const dropDarek = ref(false)
const podlezani = ref(false)
document.body.addEventListener("keydown", k => {
    if (k.key.toLowerCase() == "d") {
        dropDarek.value = true
    }
})

const fotkaVybrana = ref(0)
const maxFotek = 12
let fotogalerie = ref<string[]>([])
const loadFotky = async () => {
    for (let i = 1; i <= maxFotek; i++) {
        fotogalerie.value.push(await import(`./obrazky/karusel/p${i}.webp`).then(res => res.default))
    }
}
loadFotky()

const posunoutFotku = (kam: number) => {
    let allFotky = document.querySelectorAll(".fotka").forEach((fotka) => {
        if (kam == 1 && fotkaVybrana.value < maxFotek - 1) {
            document.querySelectorAll(".fotkaBG").forEach(bg => {
                bg.style.opacity = 0.5
                setTimeout(() => bg.style.opacity = 1, 100);
            })
            fotka.style.animationName = `posunoutFotkyZpatky`
        }
        else if (kam == -1 && fotkaVybrana.value > 0) {
            fotka.style.animationName = `posunoutFotkyTam`
            document.querySelectorAll(".fotkaBG").forEach(bg => {
                bg.style.opacity = 0.5
                setTimeout(() => bg.style.opacity = 1, 100);
            })
        }
        else if (Math.abs(kam) > 1) {
            fotka.style.animationName = `posunoutFotkyNekam`
            document.querySelectorAll(".fotkaBG").forEach(bg => {
                bg.style.opacity = 0.5
                setTimeout(() => bg.style.opacity = 1, 100);
            })
        }
    })
    setTimeout(() => {
        fotkaVybrana.value = Math.max(0, Math.min(fotkaVybrana.value + kam, maxFotek - 1))
        let allFotky = document.querySelectorAll(".fotka").forEach((fotka) => {
            fotka.style.animationName = ``
        })
    }, 100);
}

const bonusScroll = ref()
const bonusCurr = ref(0)
const scrollBonus = (val: number) => {
    bonusCurr.value = Math.min(Math.max(0, bonusCurr.value + val), bonusScroll.value.childElementCount - 1)
    bonusScroll.value.scrollLeft = bonusCurr.value * 848
}

</script>

<template>
    <div class="absolute top-0 w-screen h-screen -z-10 will-change-transform">
    
    <div class="absolute w-full h-full bg-cover will-change-transform" :style="{ backgroundImage: `url(${pozadi})` }">
    </div>

    <div class="absolute fotkaBG top-[100vh] w-full h-full bg-cover bg-center grayscale brightness-[0.1] will-change-transform transition-opacity duration-100"
        :style="{ backgroundImage: `url(${fotogalerie[fotkaVybrana]})` }"></div>
    <div class="absolute top-[100vh] w-full h-full blur-2xl mix-blend-color-dodge transition-opacity duration-100">
        <div class="absolute inset-0 w-full h-full bg-center bg-cover will-change-transform"
        :style="{ clipPath: 'polygon(25% 20%, 74% 20%, 74% 94%, 25% 94%)', backgroundImage: `url(${fotogalerie[fotkaVybrana]})` }">
        </div>
    </div>

        
    <div class="absolute top-[200vh] w-full h-full bg-cover will-change-transform"
        :style="{ backgroundImage: `url(${pozadi2})` }"></div>
    <div class="absolute top-[300vh] w-full h-full bg-cover will-change-transform"
        :style="{ backgroundImage: `url(${pozadi3})` }"></div>
        <div class="absolute top-0 right-0 z-10 w-1/2 h-[400vh] bg-gradient-to-l to-transparent from-geo-50"></div>
        <div class="absolute top-[400vh] w-full h-full bg-cover will-change-transform"
            :style="{ backgroundImage: `url(${pozadi6})` }"></div>
    </div>

    <Scrollbar @goto="currScroll = $event; reposition(true)" class="max-sm:hidden" />
    <button class="absolute z-50 w-full opacity-50 sm:hidden" v-if="currScroll < STRANKY - 1"
        :style="{ top: `${100 * (currScroll + 1)}vh` }"
        @click="currScroll = Math.min(currScroll + 1, STRANKY - 1); reposition(true)">
        <scrollDown class="absolute bottom-2 left-1/2 animate-pulse -translate-x-1/2" />
    </button>


    <DarekPad v-if="dropDarek" @open-gift="podlezani = true; dropDarek = false;" />
    <Darek @close="podlezani = false" v-if="podlezani" />

    <!-- Pozadi -->
    <main class="mx-auto w-screen max-w-[92rem] ">
        <div class="flex flex-col justify-center items-end w-full h-screen text-right sm:pr-16">
            <h1
                class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">
                {{ $t('homepage.geocaching') }}</h1>
            <p class="px-2 w-full text-xl font-medium text-white max-sm:text-xl max-sm:text-center">
                {{ $t('homepage.whatItIs') }}
            </p>
            <div class="flex flex-wrap gap-y-6 gap-x-16 justify-end px-6 mx-auto mt-12 mr-0 w-full max-sm:justify-center">
                <RouterLink @focus="currScroll = 0; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="videa/hledani-kesky">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        {{ $t('homepage.action') }}
                    </div>
                </RouterLink>
                <RouterLink @focus="currScroll = 0; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="videa/co-je-geocaching">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        {{ $t('homepage.aboutGeocaching') }}
                    </div>
                </RouterLink>
            </div>
        </div>

        <div class="flex flex-col justify-center items-center w-full h-screen text-center sm:pr-16">
            <h1
                class="text-[min(5rem,10vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">
                {{ $t('homepage.gallery') }}</h1>
            <div class="flex justify-center w-full">
                <div class="relative">
                    <div
                        class="w-[40rem] max-h-[60vh] relative max-w-[95vw] aspect-[4/3] border-4 rounded-md border-geo-400 overflow-clip">
                        <img :src="fotogalerie[fotkaVybrana - 1]"
                            class="absolute max-h-[60vh] -left-full w-full h-full duration-200 fotka" v-if="fotkaVybrana > 0">
                        <img :src="fotogalerie[fotkaVybrana]" class="absolute left-0 w-full max-h-[60vh] h-full duration-200 fotka">
                        <img :src="fotogalerie[fotkaVybrana + 1]"
                            class="absolute max-h-[60vh] -right-full w-full h-full duration-200 fotka"
                            v-if="fotkaVybrana < maxFotek - 1">
                    </div>

                    <div
                        class="flex absolute justify-between max-w-[90vw] w-[120%] left-1/2 h-[30rem] max-h-[60vh] items-center -translate-x-1/2 top-0">
                        <button class="w-10 text-3xl rounded-full bg-geo-400 aspect-square"
                            @focus="currScroll = 1; reposition()" @click="posunoutFotku(-1)">&lt;</button>
                        <button class="w-10 text-3xl rounded-full bg-geo-400 aspect-square"
                            @focus="currScroll = 1; reposition()" @click="posunoutFotku(1)">></button>
                    </div>

                    <div class="flex gap-3 justify-center mt-3 mb-[12vh]">
                        <button v-for="dot in maxFotek" @focus="currScroll = 1; reposition()"
                            class="w-3 h-3 bg-black bg-opacity-30 rounded-full border-2 border-black backdrop-invert transition-transform hover:scale-110 active:scale-125"
                            :class="{ 'bg-geo-400': dot == fotkaVybrana + 1 }"
                            @click="posunoutFotku(dot - (fotkaVybrana + 1))"></button>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col justify-center items-end w-full h-screen text-right sm:pr-16">
            <h1
                class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">
                {{ $t('homepage.start') }}</h1>
            <p class="px-2 w-full text-xl font-medium text-white max-sm:text-xl max-sm:text-center">
                {{ $t('homepage.gps') }}
            </p>
            <div class="flex flex-wrap gap-y-6 gap-x-16 justify-end px-6 mx-auto mt-12 mr-0 w-full max-sm:justify-center">
                <RouterLink @focus="currScroll = 2; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="nastenka">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        {{ $t('homepage.pinboard') }}
                    </div>
                </RouterLink>
                <RouterLink @focus="currScroll = 2; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="videa/cim-hledat">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        {{ $t('homepage.apps') }}
                    </div>
                </RouterLink>
            </div>
        </div>

        <div class="flex flex-col justify-center items-start w-full h-screen text-right sm:pr-16">
            <h1
                class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-ext-fia">
                {{ $t('homepage.links') }}</h1>
            <div
                class="flex flex-wrap gap-x-4 gap-y-6 justify-end mx-auto w-full text-center max-sm:px-2 max-sm:gap-y-2 max-sm:justify-center">
                <a @focus="currScroll = 3; reposition()" href="https://geocaching.com"
                    class="w-[11rem] max-sm:w-full rounded-md border-r-4 border-b-4 border-geo-400 sm:h-48 flex sm:flex-col sm:justify-center gap-3 items-center sm:p-2 max-sm:p-1 text-white bg-black bg-opacity-60"
                    target="_blank">
                    <img src="./ikony/odkazGC.webp" class="w-16 max-sm:w-10" alt="">
                    <p class="sm:h-12">{{ $t('homepage.link1') }}</p>
                </a>
                <a @focus="currScroll = 3; reposition()" href="http://www.geocaching.cz/"
                    class="w-[11rem] max-sm:w-full rounded-md border-r-4 border-b-4 border-geo-400 sm:h-48 flex sm:flex-col sm:justify-center gap-3 items-center sm:p-2 max-sm:p-1 text-white bg-black bg-opacity-60"
                    target="_blank">
                    <img src="./ikony/odkazKesky.webp" class="w-16 max-sm:w-10" alt="">
                    <p class="sm:h-12">{{ $t('homepage.link2') }}</p>
                </a>
                <a @focus="currScroll = 3; reposition()" href="https://kesky.cz"
                    class="w-[11rem] max-sm:w-full rounded-md border-r-4 border-b-4 border-geo-400 sm:h-48 flex sm:flex-col sm:justify-center gap-3 items-center sm:p-2 max-sm:p-1 text-white bg-black bg-opacity-60"
                    target="_blank">
                    <img src="./ikony/odkazClanek.webp" class="w-16 max-sm:w-10" alt="">
                    <p class="sm:h-12">{{ $t('homepage.link3') }}</p>
                </a>
                <div @focus="currScroll = 3; reposition()"
                    class="w-[11rem] max-sm:w-full rounded-md border-r-4 border-b-4 border-geo-400 sm:h-48 flex sm:flex-col sm:justify-center gap-3 items-center sm:p-2 max-sm:p-1 text-white bg-black bg-opacity-60"
                    target="_blank">
                    <img src="./ikony/odkazMobil.webp" class="w-16 max-sm:w-10" alt="">
                    <p class="sm:h-4">{{ $t('homepage.link4') }}</p>
                    <div class="flex gap-4">
                        <a @focus="currScroll = 3; reposition()"
                            href="https://play.google.com/store/apps/details?id=com.groundspeak.geocaching.intro"><img
                                src="./ikony/odkazGP.webp" alt=""></a>
                        <a @focus="currScroll = 3; reposition()"
                            href="https://apps.apple.com/us/app/geocaching/id329541503"><img src="./ikony/odkazApple.webp"
                                alt=""></a>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col justify-center items-center w-full h-screen text-center sm:pr-16">
            <h1
                class="text-[min(5rem,10vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">
                {{ $t('homepage.bonuses') }}</h1>
            <div class="flex justify-center w-full">
                <div class="relative">
                    <div
                        ref="bonusScroll"
                        class="aspect-video scroll-smooth grid grid-cols-[repeat(4,53rem)] grid-flow-col relative h-[30rem] border-4 rounded-md border-geo-400 overflow-hidden">
                        <BonusContainer>
                            <img loading="eager" src="@/bonusy/hnusáci.webp" class="h-full" alt="">
                        </BonusContainer>
                        <BonusContainer>
                            <img loading="eager" src="@/bonusy/dk0.webp" class="w-full" alt="">
                        </BonusContainer>
                        <BonusContainer>
                            <img loading="eager" src="@/bonusy/dk1.webp" class="w-full" alt="">
                        </BonusContainer>
                        <BonusContainer>
                            <img loading="eager" src="@/bonusy/dk2.webp" class="w-full" alt="">
                        </BonusContainer>
                        <BonusContainer>
                            <img loading="eager" src="@/bonusy/dk3.webp" class="w-full" alt="">
                        </BonusContainer>
                        <BonusContainer>
                            <img loading="eager" src="@/bonusy/past.webp" class="w-full" alt="">
                        </BonusContainer>
                        <BonusContainer>
                            <div class="flex flex-col gap-6 justify-center h-full">
                                <h2 class="text-4xl">Vrstvy menu hudby</h2>
                                <audio :src="audio" controls></audio>
                                <audio :src="audio1" controls></audio>
                                <audio :src="audio2" controls></audio>
                                <audio :src="audio3" controls></audio>
                                <audio :src="audio4" controls></audio>
                            </div>
                        </BonusContainer>
                        <BonusContainer>
                            <div class="flex gap-3 justify-center items-center h-full">
                                <img loading="eager" src="@/bonusy/debug.png" class="h-[90%]" alt="">
                                <h2 class="text-4xl">Debug menu</h2>
                            </div>
                        </BonusContainer>
                        <BonusContainer>
                            <div class="flex flex-col gap-6 justify-center h-full">
                                <h2 class="text-4xl">Nepoužitá hudba</h2>
                                <audio :src="audioTut" controls></audio>
                            </div>
                        </BonusContainer>
                        
                        <BonusContainer>
                            <div class="flex flex-col gap-6 justify-center h-full">
                                <h2 class="text-2xl">Co Vás vede k využívání ne úplně typických SW produktů?</h2>
                                <hr class="border-geo-400">
                                <ul class="text-2xl list-disc text-left">
                                    <li>Zvládnou vše, co potřebuji</li>
                                    <li>Zadarmo a s otevřeným zdrojovým kódem</li>
                                    <li>Bez telemetrie</li>
                                    <li>Bez reklam, účtů, umělé inteligence</li>
                                </ul>
                            </div>
                        </BonusContainer>
                        <BonusContainer>
                            <div class="flex flex-col gap-6 justify-center items-center h-full">
                                <h2 class="text-2xl">Má LMMS podporu MIDI rozhraní pro el. hudební nástroje?</h2>
                                <hr class="w-full border-geo-400">
                                <img src="@/bonusy/midi.png" class="w-64" alt="">
                            </div>
                        </BonusContainer>
                        <BonusContainer>
                            <div class="flex flex-col gap-6 justify-center h-full">
                                <h2 class="text-2xl">Kolik vás stojí hosting webu?</h2>
                                <hr class="border-geo-400">
                                <p class="text-2xl leading-loose text-left">
                                    <u>2023:</u> 377 Kč<br>
                                    <u>2022:</u> 193 Kč (se slevou)<br>
                                    <u>Doména (1 rok):</u> 301 Kč
                                </p>
                            </div>
                        </BonusContainer>
                        <BonusContainer>
                            <div class="flex flex-col gap-6 justify-center h-full">
                                <h2 class="text-2xl">Jak dlouho hrajete Geocaching?</h2>
                                <hr class="border-geo-400">
                                <img src="@/bonusy/stat.png" class="w-[35rem]" alt="">
                            </div>
                        </BonusContainer>
                    </div>

                    <button class="absolute -left-16 top-1/2 w-10 text-3xl rounded-full -translate-y-16 bg-geo-400 aspect-square"
                        @focus="currScroll = 4; reposition()" @click="scrollBonus(-1)">&lt;</button>
                    <button class="absolute -right-16 top-1/2 w-10 text-3xl rounded-full -translate-y-16 bg-geo-400 aspect-square"
                        @focus="currScroll = 4; reposition()" @click="scrollBonus(1)">></button>

                    <div class="flex gap-3 justify-center mt-3 mb-[12vh]">
                        <button v-for="dot in bonusScroll?.childElementCount" @focus="currScroll = 4; reposition()"
                            class="w-3 h-3 bg-black bg-opacity-30 rounded-full border-2 border-black backdrop-invert transition-transform hover:scale-110 active:scale-125"
                            :class="{ 'bg-geo-400': dot == bonusCurr + 1 }"
                            @click="scrollBonus(dot - (bonusCurr + 1))"></button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.skewButton {
    filter: drop-shadow(5px 5px white);
    transform: translate(0, 0);
    transition: transform 75ms, filter 75ms;
}

.skewButton:hover {
    transform: translate(5px, 5px);
    filter: drop-shadow(0px 0px white);
}
</style>

<style>
@keyframes posunoutFotkyZpatky {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-100%);
    }
}

@keyframes posunoutFotkyTam {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(100%);
    }
}

@keyframes posunoutFotkyNekam {
    from {
        opacity: 1;
    }

    to {
        opacity: 0.5;
    }
}

.fotka {
    animation-duration: 100ms;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}</style>
