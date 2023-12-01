<script setup lang="ts">
import thumb from '@/obrazky/hrynahledy/menuBG2.webp'
import hry from './assety/hry';

</script>

<template>
    <main class="flex gap-6 p-6 mx-auto w-full h-full grow">
        <RouterLink
            v-for="hra in hry"
            :to="`/hry/${hra.url}`" 
            class="border-2 bg-cover flex flex-col justify-end bg-top hover:bg-[center_10%] ease-in-out duration-100 relative transition-[background-position] border-geo-400 w-full h-full" 
            :style="{backgroundImage: `url(${thumb})`}"
        >
            <div class="w-full h-1/2 bg-gradient-to-t to-transparent from-geo-400"></div>
            <div class="absolute bottom-0 w-full leading-snug overflow-x-clip">
                <h1 class="isolate text-4xl font-normal">{{ hra.nazev }}</h1>
                <p class="isolate text-sm">{{ hra.popis }}</p>
            </div>
        </RouterLink>
    </main>    
</template>