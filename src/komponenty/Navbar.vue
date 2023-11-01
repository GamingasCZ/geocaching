<script setup lang="ts">
import Logo from "../ikony/logo.svg";

import IkonaVidea from "../ikony/videa.svg"
import IkonaHry from "../ikony/hry.svg"
import IkonaClanky from "../ikony/clanky.svg"
import IkonaNastenka from "../ikony/nastenka.svg"
import { ref } from "vue";

const tlacitka = [
    {na: 'videa', ikona: IkonaVidea, text: 'Videa'},
    {na: 'hry', ikona: IkonaHry, text: 'Hry'},
    {na: 'nastenka', ikona: IkonaNastenka, text: 'Nástěnka'},
]

const vybranaStranka = ref(-1)

</script>

<template>
    <nav
        class="flex sticky z-40 m-4 w-auto h-12"
    >
        <!-- Logo -->
        <img src="../ikony/logo.svg" class="box-border p-1" alt="">
        <div class="my-auto text-xl leading-none text-center max-sm:hidden">
            <h2 class="font-black">Chytej</h2>
            <span class="tracking-widest">Kešky</span>
        </div>

        <!-- Odkazy -->
        <section class="flex items-center ml-20">
            <RouterLink v-for="(odkaz, index) in tlacitka" :to="odkaz.na">
                <button
                    class="flex gap-2 transition-[gap] items-center text-lg tracking-wide text-black font-bold max-sm:w-12 sm:w-36"
                    :class="{'!gap-[0.8rem]': vybranaStranka == index}"
                    @click="vybranaStranka = index"
                >
                    <div
                        class="absolute h-full bg-black bg-opacity-0 transition-colors -skew-x-12 max-sm:w-12 sm:w-36 hover:bg-opacity-20"
                        :class="{'!bg-opacity-40': vybranaStranka == index}"
                    ></div>
                    <component :is="odkaz.ikona" />
                    <span class="transition-transform max-sm:hidden">{{ odkaz.text }}</span>
                </button>
            </RouterLink>
        </section>

        <div></div>
    </nav>
</template>