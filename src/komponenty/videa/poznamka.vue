<script setup lang="ts">

defineProps<{
    nazev: string
    text: string
    cas: string
    url: string
}>()

</script>

<template>
    <RouterLink :to="`/videa/${url}`" class="min-w-full">
        <div class="relative p-1 pl-2 text-white border-b-4 bg-geo-50 border-b-ext-fia noteFooter">
            <h1 class="font-bold font-lg">{{ nazev }}</h1>
            <p class="text-xs">{{ text }}</p>
            <footer class="m-0.5">
                <span class="p-1 text-sm bg-black rounded-md">{{ cas }}</span>
            </footer>
        </div>
    </RouterLink>
</template>

<style>
.noteFooter::after {
    @apply content-[''] w-5 h-5 bg-ext-fia absolute bottom-0 right-0;
    clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
}

</style>