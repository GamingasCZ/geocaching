<script setup lang="ts">
import { onMounted, ref } from "vue"

defineProps<{
    text: string;
}>()

const notmounted = ref(true)
const notif = ref<HTMLDivElement>()
onMounted(() => {
    notmounted.value = false
    setTimeout(() => {
        notmounted.value = true
        setTimeout(() => {
            notif.value?.remove()
        }, 250);
    }, 1500);
})

</script>

<template>
    <div :class="{'!opacity-0 !translate-x-8': notmounted}" ref="notif" class="z-50 px-5 py-3 pr-10 w-max text-lg opacity-100 transition-all translate-x-0 skewButton bg-geo-400 drop-shadow-sharp font-bolder">
        <p>{{ text }}</p>
    </div>
</template>
