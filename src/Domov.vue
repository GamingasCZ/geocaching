<script setup lang="ts">

import Pozadi from "./obrazky/pozadi2.svg";

</script>

<template>
    <div class="absolute top-0 w-screen h-screen overflow-clip -z-10 will-change-transform">
        <div class="w-full bg-cover h-full bg-[url(@/obrazky/pozadi22.webp)] absolute will-change-transform"></div>
        <div class="w-full bg-cover h-full bg-[url(@/obrazky/pozadi21.webp)] absolute will-change-transform"></div>
        <div class="absolute top-0 right-0 z-10 w-1/2 h-full bg-gradient-to-l to-transparent from-geo-50"></div>
    </div>
    <main class="z-50 mx-auto w-screen h-screen">
        <!-- Pozadi -->
        <!-- <div class="absolute top-0 left-0 w-screen h-screen -z-50 bg-cover bg-[url('@/obrazky/pozadi.svg')]">
            <div class="absolute top-0 right-0 w-96 h-full bg-gradient-to-r from-transparent to-geo-50"></div>
        </div> -->

        <div class="flex flex-col justify-center items-end pr-4 w-full h-full text-right">
            <h1 class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text bg-gradient-to-br to-geo-400 from-geo-600">Geocaching</h1>
            <p class="w-full max-w-[min(40rem,95vw)] max-sm:text-xl text-xl font-medium text-right text-white max-sm:text-center">
                je celosvětová hra o hledání pokladů, skrytých po celém světě!
            </p>
            <div class="grid grid-rows-2 gap-6 justify-center px-6 mx-auto mt-10 mr-0 w-max">
                <button class="px-12 py-2 text-xl bg-geo-400 skewButton">
                    Jak začít
                </button>
                <RouterLink to="videa/co-je-geocaching" class="w-full">
                    <button class="px-12 py-2 w-max text-xl bg-geo-400 skewButton">
                        O Geocachingu
                    </button>
                </RouterLink>
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