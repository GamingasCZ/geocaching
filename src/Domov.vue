<script setup lang="ts">
import pozadi from './obrazky/pozadi2.svg?url'
import pozadi2 from './obrazky/pozadi3.svg?url'


document.documentElement.addEventListener("scroll", e => console.log(e))

</script>

<template>
    <div class="absolute top-0 w-screen h-screen -z-10 will-change-transform">
        <div class="absolute w-full h-full bg-cover will-change-transform" :style="{backgroundImage: `url(${pozadi})`}"></div>
        <div class="absolute top-[100vh] w-full h-full bg-cover will-change-transform" :style="{backgroundImage: `url(${pozadi2})`}"></div>
        <div class="absolute top-0 right-0 z-10 w-1/2 h-[200vh] bg-gradient-to-l to-transparent from-geo-50"></div>
    </div>
    <main class="mx-auto w-screen max-w-[92rem] drop-shadow-sharp">
        <!-- Pozadi -->
        <!-- <div class="absolute top-0 left-0 w-screen h-screen -z-50 bg-cover bg-[url('@/obrazky/pozadi.svg')]">
            <div class="absolute top-0 right-0 w-96 h-full bg-gradient-to-r from-transparent to-geo-50"></div>
        </div> -->

        <div class="flex flex-col justify-center items-end w-full h-screen text-right sm:pr-4 snap-start scroll-smooth">
            <h1 class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">Geocaching</h1>
            <p class="w-full max-w-[min(40rem,95vw)] max-sm:text-xl text-xl font-medium text-white max-sm:text-center">
                je celosvětová hra o hledání pokladů, skrytých po celém světě!
            </p>
            <div class="flex flex-wrap gap-y-6 gap-x-16 justify-end px-6 mx-auto mt-12 mr-0 w-full max-sm:justify-center">
                <button class="py-2 w-48 text-xl bg-geo-400 skewButton">
                    Jak začít
                </button>
                <RouterLink to="videa/co-je-geocaching">
                    <button class="py-2 w-48 text-xl bg-geo-400 skewButton">
                        O Geocachingu
                    </button>
                </RouterLink>
            </div>
        </div>
        
        <div class="flex flex-col justify-center items-end w-full h-screen text-right sm:pr-4 snap-start scroll-smooth">
            <h1 class="text-[min(7rem,15vw)] font-black leading-snug text-transparent bg-clip-text max-sm:text-center w-full bg-gradient-to-br to-geo-400 from-geo-600">Jak začít?</h1>
            <p class="w-full max-w-[min(40rem,95vw)] max-sm:text-xl text-xl font-medium text-right text-white max-sm:text-center">
                stačí k tomu cokoliv s GPS přijímačem!
            </p>
            <div class="flex flex-wrap gap-y-6 gap-x-16 justify-end px-6 mx-auto mt-12 mr-0 w-full max-sm:justify-center">
                <RouterLink to="videa/cim-hledat">
                    <button class="py-2 w-48 text-xl bg-geo-400 skewButton">
                        Video
                    </button>
                </RouterLink>
                <a href="https://kesky.cz/aplikace/geocaching-na-mobilu/" target="_blank">
                    <button class="py-2 w-48 text-xl bg-geo-400 skewButton">
                        Mobilní aplikace
                    </button>
                </a>
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