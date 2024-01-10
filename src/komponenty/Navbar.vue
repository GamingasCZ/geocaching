<script setup lang="ts">
import IkonaVidea from "../ikony/videa.svg" 
import IkonaHry from "../ikony/hry.svg"
import IkonaNastenka from "../ikony/nastenka.svg"
import Logo from "../ikony/logo.svg"
import { ref } from "vue";

const tlacitka = [
    {na: '/videa', ikona: IkonaVidea, text: 'Videa'},
    {na: '/hry', ikona: IkonaHry, text: 'Hry'},
    {na: '/nastenka', ikona: IkonaNastenka, text: 'Nástěnka'},
]

const vybranaStranka = ref(-1)

const floating = ref(false)

window.addEventListener("scroll", () => {
    floating.value = document.documentElement.scrollTop > 0
})

</script>

<template>
    <nav
    class="flex fixed z-40 mb-36 left-1/2 top-3 after:-skew-x-12 -translate-x-1/2 mx-auto max-w-[90rem] h-12 w-full transition-[top] ease-linear duration-[35ms]"
    :class="{'!top-0 after:!skew-x-0': floating}"
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
                    <span class="transition-transform max-sm:hidden">{{ odkaz.text }}</span>
                </button>
            </RouterLink>
        </section>

        <div></div>
    </nav>
</template>
