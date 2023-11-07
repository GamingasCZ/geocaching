<script setup lang="ts">

</script>
<template>
    <RouterLink
        to="/" 
        class="border-2 bg-cover bg-top hover:bg-[center_10%] ease-in-out duration-100 transition-[background-position] border-geo-400 max-w-[30vw] w-[24rem] pt-28 block" 
        :style="{backgroundImage: 'url(https://www.parentmap.com/images/article/7565/geocache-398019_1280.jpg)'}
    ">
        <div class="relative p-0.5 leading-snug bg-opacity-70 backdrop-blur-sm overflow-x-clip bg-geo-400 videoBlur">
            <h1 class="isolate text-xl font-bold">Video</h1>
            <p class="isolate text-xs">Toto je video.</p>
        </div>
    </RouterLink>
</template>

<style>

.videoBlur::before {
    @apply content-[''] from-geo-400 to-transparent bg-gradient-to-t inline-block w-full absolute -top-16 left-0 h-16;
}

</style>