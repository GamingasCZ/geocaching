<script setup lang="ts">
import IkonaVidea from "../ikony/videa.svg" 
import IkonaHry from "../ikony/hry.svg"
import IkonaNastenka from "../ikony/nastenka.svg"
import IkonaJazyk from "../ikony/jazyk2.svg"
import IkonaCZ from "../ikony/cesky.svg"
import IkonaUK from "../ikony/english.svg"


import Logo from "../ikony/logo.svg"
import { nextTick, ref } from "vue";
import { i18n, setLanguage } from "@/locales"

const tlacitka = [
    {na: '/videa', ikona: IkonaVidea, text: 'videos'},
    {na: '/hry', ikona: IkonaHry, text: 'games'},
    {na: '/nastenka', ikona: IkonaNastenka, text: 'pinboard'},
]

const vybranaStranka = ref(-1)

const floating = ref(false)
const hidden = ref(false)
const langOpen = ref(false)

window.addEventListener("scroll", () => {
    floating.value = document.documentElement.scrollTop > 0
    hidden.value = document.documentElement.scrollTop > window.innerHeight/10
})

const setLang = (ind: 0 | 1) => {
    setLanguage(ind);
    langOpen.value = false
    setTimeout(() => {
        window.location.reload()
    }, 10)
}

</script>

<template>
    <nav
    class="flex sticky z-40 top-3 after:-skew-x-12 mx-auto max-w-[90rem] h-12 w-full transition-[top] ease-linear duration-[75ms]"
    :class="{'!-top-12 after:!skew-x-0': hidden}"
    >
        <!-- Logo -->
        <RouterLink class="flex ml-4" to="/" @click="vybranaStranka = -1">
            <component :is="Logo" class="mt-2 ml-2 w-11 h-11"/>
            <div class="my-auto text-xl leading-none text-center max-sm:hidden">
                <h2 class="font-black">Chytej</h2>
                <span class="tracking-widest">Kešky</span>
            </div>
        </RouterLink>

        <!-- Odkazy -->
        <section class="flex items-center sm:ml-20">
            <RouterLink v-for="(odkaz, index) in tlacitka" :to="odkaz.na" class="h-full">
                <button
                    class="relative h-full flex gap-2 transition-[gap] items-center text-lg tracking-wide text-black font-bold pl-5 pr-3 min-w-[2rem] navButton"
                    :class="{'!gap-[0.8rem]': vybranaStranka == index}"
                    @click="vybranaStranka = index"
                    :data-vybrano="vybranaStranka == index"
                >
                    <div
                        class="absolute pr-3 pl-5 min-w-full h-full bg-black bg-opacity-0 transition-colors -skew-x-12 hover:bg-opacity-20"
                    ></div>
                    <component :is="odkaz.ikona" />
                    <span class="transition-transform max-sm:hidden">{{ $t(`nav.${odkaz.text}`) }}</span>
                </button>
            </RouterLink>
        </section>

        <div class="flex relative items-center mr-6 ml-auto">
            <button @click="langOpen = !langOpen" class="h-full flex transition-[gap] items-center text-lg tracking-wide justify-center text-black font-bold pl-5 pr-1 min-w-[2rem] navButton">
                <IkonaJazyk />
            </button>
            <fieldset v-if="langOpen" class="flex absolute right-0.5 -bottom-full gap-4 justify-center items-center w-32 h-12 -skew-x-12 bg-geo-300">
                <button @click="setLang(0)" class="w-9 h-9 rounded-full border-2 border-black skew-x-12 outline-geo-400 outline-4">
                    <IkonaCZ class="scale-[2] translate-x-2" />
                </button>
                <button @click="setLang(1); langOpen = false" class="w-9 h-9 rounded-full border-2 border-black skew-x-12 outline-geo-400 outline-4">
                    <IkonaUK class="scale-[2] translate-x-2" />
                </button>
            </fieldset>
        </div>
    </nav>
</template>
