<script setup lang="ts">

import Pozadi from "./obrazky/pozadi2.svg";

</script>

<template>
    <Pozadi class="absolute -z-10" />
    <main class="mx-auto max-w-[93rem] z-50">
        <!-- Pozadi -->
        <!-- <div class="absolute top-0 left-0 w-screen h-screen -z-50 bg-cover bg-[url('@/obrazky/pozadi.svg')]">
            <div class="absolute top-0 right-0 w-96 h-full bg-gradient-to-r from-transparent to-geo-50"></div>
        </div> -->

        <div class="my-36 ml-auto w-max text-right">
            <h1 class="text-[min(6rem,15vw)] font-black leading-snug text-transparent bg-clip-text bg-gradient-to-br to-geo-400 from-geo-600">Geocaching</h1>
            <p class="w-full max-w-[min(36rem,90vw)] text-lg font-medium text-right text-white max-sm:text-sm">
                je celosvětová hra o hledání pokladů, skrytých všude okolo nás!
                Od těch nejvyšších vrcholků, po nejhlubší lesy, a možná i hned pod vašimi okny.
                Kešky jsou skryty všude a jen čekají na to, než je ulovíte!</p>
            <div class="flex gap-8 justify-around mt-16 max-sm:flex-col">
                <button class="px-12 py-2 text-xl bg-geo-400 skewButton">Jak začít</button>
                <button class="px-12 py-2 text-xl bg-geo-400 skewButton">O Geocachingu</button>
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