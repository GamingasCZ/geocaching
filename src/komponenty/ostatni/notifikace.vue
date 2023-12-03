<script setup lang="ts">
import { onMounted, ref } from "vue"

defineProps<{
    text: string;
}>()

const notmounted = ref(true)
onMounted(() => {
    notmounted.value = false
})

</script>

<template>
    <!-- https://stackoverflow.com/questions/69488256/vue-3-append-component-to-the-dom-best-practice -->
<Teleport to="body">
    <div :class="{'opacity-0 translate-x-8': notmounted}" class="skewButton transition-transform transition-opacity bg-geo-400 !fixed bottom-8 right-8 drop-shadow-sharp pr-10 z-50 font-bolder text-lg w-max py-3 px-5">
        <p>{{ text }}</p>
    </div>
</Teleport>
</template>
