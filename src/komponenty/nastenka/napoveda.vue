<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    open: boolean
}>()
const emit = defineEmits<{
    (e: "close"): void
}>()


const dialog = ref<HTMLDialogElement>()
watch(props, () => {
    dialog.value?.showModal()
})

const close = () => {
    dialog.value?.close()
}
dialog.value?.addEventListener("close", close)

</script>

<template>
    <dialog ref="dialog" class="max-w-5xl leading-relaxed text-black bg-transparent underlineThick backdrop:bg-black backdrop:bg-opacity-70 drop-shadow-sharp">
        <div class="flex justify-between">
            <header>{{ $t('other.help') }}</header>
            <button class="px-2 text-2xl text-black bg-ext-red" @click="close">X</button>
        </div>
        <div class="p-2 bg-geo-300">
            <h2 class="mt-2 text-2xl font-bold">{{ $t('nast.dia1') }}</h2>
            <p class="pl-3">{{ $t('nast.dia2') }}</p>

            <h2 class="mt-2 text-2xl font-bold">{{ $t('nast.dia3') }}</h2>
            <p class="pl-3" v-html="$t('nast.dia4')"></p>
            <h2 class="mt-2 text-2xl font-bold">{{ $t('nast.dia5') }}</h2>
            <p class="pl-3" v-html="$t('nast.dia6')"></p>
        </div>
    </dialog>
</template>