<script setup lang="ts">
import darek from "@/obrazky/darek.svg";
import { onMounted, ref } from "vue";

const emit = defineEmits<{
    (e: "openGift"): void
}>()
const animace = ref(false)

onMounted(() => {
    setTimeout(() => {
        animace.value = true
    }, 100);
})

</script>

<template>
    <darek @click="emit('openGift')" class="absolute scale-[4] left-[59vw] top-[68vh] transition-all cursor-pointer -translate-y-80 duration-1000 opacity-0 active:scale-[5.5] hover:scale-[5]" :class="{'!translate-y-0 !opacity-100': animace}" />
</template>