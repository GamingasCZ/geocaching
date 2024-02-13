<script setup lang="ts">

import confetti from "canvas-confetti";
import { onMounted, ref } from "vue";

const emit = defineEmits<{
    (e: "close"): void
}>()

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

let epic = setInterval(() => {
    confetti({
        spread: 360,
        particleCount: 300,
        origin: {x: random(0.1, 0.3), y: Math.random()-0.2}
    })
    confetti({
        spread: 360,
        particleCount: 300,
        origin: {x: random(0.5, 0.9), y: Math.random()-0.2}
    })
}, 1000)

const showText = ref(false)
const hidden = ref(true)
onMounted(() => {
    hidden.value = false
})

setTimeout(() => {
    showText.value = true
}, 1000);

const close = () => {
    clearInterval(epic)
    hidden.value = true

    setTimeout(() => {
        emit('close')
    }, 500);
}

</script>
<template>
    <Teleport to="body">
        <div @click="close" class="absolute z-50 w-screen h-screen bg-black bg-opacity-80 opacity-100 transition-opacity duration-200" :class="{'!opacity-0': hidden}">
            <h2 class="absolute top-1/2 left-1/2 w-max text-8xl font-black text-white transition-all duration-1000 scale-0 -translate-x-1/2 -translate-y-1/2" :class="{'rotate-[360deg] scale-100': showText}">Zdravím maturitní komisi!</h2>
        </div>

    </Teleport>
</template>