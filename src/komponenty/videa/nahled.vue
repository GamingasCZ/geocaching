<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    nazev: string;
    kratkyPopis: string;
    nahled: string;
    url: string;
}>()

const nahled = ref()
const getNahled = async () => {
    nahled.value = await import(`../../obrazky/videonahledy/${props.url}-min.webp`).then(res => res.default)
}
getNahled()

</script>
<template>
    <RouterLink
        :to="`/videa/${url}`" 
        class="border-2 bg-cover bg-top hover:bg-[center_10%] ease-in-out duration-100 max-sm:w-full transition-[background-position] border-geo-400 sm:max-w-[30vw] sm:w-[24rem] pt-36 block" 
        :style="{backgroundImage: `url(${nahled})`}
    ">
        <div class="relative p-0.5 leading-snug bg-opacity-70 backdrop-blur-sm overflow-x-clip bg-geo-400 videoBlur">
            <h1 class="isolate text-xl font-bold">{{ nazev }}</h1>
            <p class="isolate text-xs">{{ kratkyPopis }}</p>
        </div>
    </RouterLink>
</template>

<style>

.videoBlur::before {
    @apply content-[''] from-geo-400 to-transparent bg-gradient-to-t inline-block w-full absolute -top-16 left-0 h-16;
}

</style>