<script setup lang="ts">
import hry from '@/assety/hry';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';


const hraIndex = computed(() => {
    let param = useRouter().currentRoute.value.params.hra
    return hry.findIndex(x => x.url == param)
})

const gameLink = ref()
const getGame = async () => {
    gameLink.value = await import(`../hry/${hry[hraIndex.value].url}/index.html`).then(res => res.default)
    // thumbTotoVideo.value = await import(`@/obrazky/videonahledy/${Videa[videoIndex.value].url}-max.webp`).then(res => res.default)
}
getGame()

</script>

<template>
    <hra></hra>
</template>
