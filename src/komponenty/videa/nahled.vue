<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    nazev: string;
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
        class="border-2 bg-cover bg-top relative hover:bg-[center_10%] max-sm:min-w-full ease-in-out duration-100 transition-[background-position] w-[20rem] border-geo-400 grow pt-48 block" 
        :style="{backgroundImage: `url(${nahled})`}
    ">
        <div class="absolute bottom-0 p-0.5 w-full leading-snug bg-opacity-70 backdrop-blur-sm overflow-x-clip bg-geo-400 videoBlur">
            <h1 class="isolate text-xl font-bold">{{ nazev }}</h1>
        </div>
    </RouterLink>
</template>

<style>

.videoBlur::before {
    @apply content-[''] from-geo-400 to-transparent bg-gradient-to-t inline-block w-full absolute -top-16 left-0 h-16;
}

</style>