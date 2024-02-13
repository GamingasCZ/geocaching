<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import pozadi from './obrazky/pozadi2.svg?url'
import pozadi2 from './obrazky/pozadi4.svg?url'
import pozadi3 from './obrazky/pozadi5.svg?url'
import Darek from './komponenty/Darek.vue';
import DarekPad from './komponenty/DarekPad.vue';
import Scrollbar from './komponenty/ostatni/Scrollbar.vue';

const STRANKY = 4

let dragStart = 0
document.documentElement.ontouchmove = e => {
    console.log(e)
    e.preventDefault()
    if (!isScrolling.value) {
        isScrolling.value = true
        setTimeout(() => isScrolling.value = false, 250);

        if (e.deltaY < 0) currScroll.value -= 1
        else currScroll.value += 1

        window.scrollTo({ top: window.innerHeight * currScroll.value, behavior: 'smooth' })
    }
}
document.documentElement.ontouchend = () => dragStart = 0

window.onresize = () => reposition(false)

const isScrolling = ref(false)
const currScroll = ref(0)
document.documentElement.onwheel = e => {
    e.preventDefault()
    if (!isScrolling.value) {
        isScrolling.value = true
        setTimeout(() => isScrolling.value = false, 250);

        if (e.deltaY < 0) currScroll.value = Math.max(0, currScroll.value - 1)
        else currScroll.value = Math.min(currScroll.value + 1, STRANKY - 1)

        window.scrollTo({ top: window.innerHeight * currScroll.value, behavior: 'smooth' })
    }
}

const reposition = (smooth = false) => {
    window.scrollTo({ top: window.innerHeight * currScroll.value, behavior: smooth ? 'smooth' : 'instant' })
}

onMounted(() => {
    document.body.style.overflowY = "hidden"
})
onUnmounted(() => {
    document.body.style.overflowY = "auto"
    document.documentElement.onwheel = null
    document.documentElement.ontouchmove = null
})

const dropDarek = ref(false)
const podlezani = ref(false)
document.body.addEventListener("keydown", k => {
    if (k.key.toLowerCase() == "d") {
        dropDarek.value = true
    }
})

const fotkaVybrana = ref(0)
const maxFotek = 9
let fotogalerie = ref<string[]>([])
const loadFotky = async () => {
    for (let i = 0; i < maxFotek; i++) {
        fotogalerie.value.push(await import(`./obrazky/karusel/p${i + 1}.webp`).then(res => res.default))
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

</script>

<template>
    <div class="absolute top-0 w-screen h-screen -z-10 will-change-transform">
        <div class="absolute w-full h-full bg-cover will-change-transform" :style="{ backgroundImage: `url(${pozadi})` }">
        </div>
        <div class="absolute top-[100vh] w-full h-full bg-cover will-change-transform"
            :style="{ backgroundImage: `url(${pozadi2})` }"></div>
        <div class="absolute top-[200vh] w-full h-full bg-cover will-change-transform"
            :style="{ backgroundImage: `url(${pozadi3})` }"></div>
        <div class="absolute fotkaBG top-[300vh] w-full h-full bg-cover bg-center grayscale brightness-[0.1] will-change-transform transition-opacity duration-100"
            :style="{ backgroundImage: `url(${fotogalerie[fotkaVybrana]})` }"></div>
        <div class="absolute top-[300vh] w-full h-full blur-2xl mix-blend-color-dodge transition-opacity duration-100">
            <div class="absolute inset-0 w-full h-full bg-center bg-cover will-change-transform"
                :style="{ clipPath: 'polygon(25% 20%, 74% 20%, 74% 94%, 25% 94%)', backgroundImage: `url(${fotogalerie[fotkaVybrana]})` }">
            </div>
        </div>
        <div class="absolute top-0 right-0 z-10 w-1/2 h-[200vh] bg-gradient-to-l to-transparent from-geo-50"></div>
    </div>

    <Scrollbar @goto="currScroll = $event; reposition(true)" />

    <DarekPad v-if="dropDarek" @open-gift="podlezani = true; dropDarek = false;" />
    <Darek @close="podlezani = false" v-if="podlezani" />

    <!-- Pozadi -->
    <main class="mx-auto w-screen max-w-[92rem] ">
        <!-- <div class="absolute top-0 left-0 w-screen h-screen -z-50 bg-cover bg-[url('@/obrazky/pozadi.svg')]">
            <div class="absolute top-0 right-0 w-96 h-full bg-gradient-to-r from-transparent to-geo-50"></div>
        </div> -->

        <div class="flex flex-col justify-center items-end w-full h-screen text-right sm:pr-4 scroll-smooth">
            <h1
                class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">
                Geocaching</h1>
            <p class="w-full max-w-[min(40rem,95vw)] max-sm:text-xl text-xl font-medium text-white max-sm:text-center">
                je celosvětová hra o hledání pokladů, skrytých po celém světě!
            </p>
            <div class="flex flex-wrap gap-y-6 gap-x-16 justify-end px-6 mx-auto mt-12 mr-0 w-full max-sm:justify-center">
                <RouterLink @focus="currScroll = 0; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="videa/hledani-kesky">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        Hledání v akci
                    </div>
                </RouterLink>
                <RouterLink @focus="currScroll = 0; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="videa/co-je-geocaching">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        O Geocachingu
                    </div>
                </RouterLink>
            </div>
        </div>

        <div class="flex flex-col justify-center items-end w-full h-screen text-right sm:pr-4 scroll-smooth">
            <h1
                class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">
                Jak začít?</h1>
            <p
                class="w-full max-w-[min(40rem,95vw)] max-sm:text-xl text-xl font-medium text-right text-white max-sm:text-center">
                stačí k tomu cokoliv s GPS přijímačem!
            </p>
            <div class="flex flex-wrap gap-y-6 gap-x-16 justify-end px-6 mx-auto mt-12 mr-0 w-full max-sm:justify-center">
                <RouterLink @focus="currScroll = 1; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="nastenka">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        Nástěnka
                    </div>
                </RouterLink>
                <RouterLink @focus="currScroll = 1; reposition()"
                    class="outline-none focus-within:brightness-150 homeButton" to="videa/cim-hledat">
                    <div class="py-2 w-48 text-xl text-center bg-geo-400 skewButton">
                        Mobilní aplikace
                    </div>
                </RouterLink>
            </div>
        </div>

        <div class="flex flex-col justify-center items-start w-full h-screen text-right sm:pr-4 scroll-smooth">
            <h1
                class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-ext-fia">
                Užitečné odkazy</h1>
            <div class="flex flex-wrap gap-y-6 gap-x-16 justify-end px-6 mx-auto mt-12 mr-0 w-full max-sm:justify-center">
                <a href="https://geocaching.com" class="max-w-sm text-white bg-black bg-opacity-40" target="_blank">
                    <img src="./obrazky/karusel/p1.webp" class="w-16" alt="">
                    <p>Oficiální stránka Geocachingu</p>
                </a>
                <a href="http://www.geocaching.cz/" class="max-w-sm text-white bg-black bg-opacity-40" target="_blank">
                    <img src="./obrazky/karusel/p1.webp" class="w-16" alt="">
                    <p>Neoficiální česká stránka</p>
                </a>
                <a href="https://kesky.cz" class="max-w-sm text-white bg-black bg-opacity-40" target="_blank">
                    <img src="./obrazky/karusel/p1.webp" class="w-16" alt="">
                    <p>Zajímavé články</p>
                </a>
            </div>
        </div>

        <div class="flex flex-col justify-center items-end w-full h-screen text-center sm:pr-4 scroll-smooth">
            <h1
                class="text-[min(5rem,10vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">
                Fotogalerie</h1>
            <div class="flex justify-center w-full">
                <div class="relative">
                    <div class="w-[40rem] relative max-w-[95vw] aspect-[4/3] border-4 rounded-md border-geo-400 overflow-clip">
                        <img :src="fotogalerie[fotkaVybrana - 1]"
                            class="absolute -left-full w-full h-full duration-200 fotka"
                            v-if="fotkaVybrana > 0">
                        <img :src="fotogalerie[fotkaVybrana]"
                            class="absolute left-0 w-full h-full duration-200 fotka">
                        <img :src="fotogalerie[fotkaVybrana + 1]"
                            class="absolute -right-full w-full h-full duration-200 fotka"
                            v-if="fotkaVybrana < maxFotek - 1">
                    </div>

                    <div
                        class="flex absolute top-1/2 justify-between max-w-[90vw] w-[120%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <button class="w-10 text-3xl rounded-full bg-geo-400 aspect-square"
                            @click="posunoutFotku(-1)">&lt;</button>
                    <button class="w-10 text-3xl rounded-full bg-geo-400 aspect-square"
                        @click="posunoutFotku(1)">></button>
                </div>

                <div class="flex gap-3 justify-center mt-3">
                    <button v-for="dot in maxFotek"
                        class="w-3 h-3 bg-black bg-opacity-30 rounded-full border-2 border-black backdrop-invert transition-transform hover:scale-110 active:scale-125"
                        :class="{'bg-geo-400': dot == fotkaVybrana+1}"
                        @click="posunoutFotku(dot - (fotkaVybrana+1))"></button>
                </div>
            </div>
        </div>
    </div>
</main></template>

<style scoped>.skewButton {
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
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
}
@keyframes posunoutFotkyTam {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
}
@keyframes posunoutFotkyNekam {
    from { opacity: 1; }
    to { opacity: 0.5; }
}

.fotka {
    animation-duration: 100ms;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>