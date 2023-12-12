<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { IntKeska } from "@/parserKesek"

const props = defineProps<{
    open: boolean;
    zaloha: any;
}>()
const emit = defineEmits<{
    (e: "close"): void,
    (e: "updateCaches", noveKesky: IntKeska[]): void
}>()


const dialog = ref<HTMLDialogElement>()
watch(props, () => {
    dialog.value?.showModal()
})

const close = () => {
    dialog.value?.close()
}
dialog.value?.addEventListener("close", close)

const pouzitZalohu = () => {
    console.log(props.zaloha.data)
    localStorage.setItem("nastenka", JSON.stringify(props.zaloha.data))
    emit("updateCaches", props.zaloha.data)
    close()
}

</script>

<template>
    <dialog ref="dialog" class="max-w-5xl leading-relaxed text-black bg-transparent underlineThick backdrop:bg-black backdrop:bg-opacity-70 drop-shadow-sharp">
        <div class="flex justify-between">
            <header>Import</header>
        </div>
        <div class="flex gap-3 p-8 bg-geo-300">
            <div class="flex flex-col gap-3">
                <div class="mb-12">
                    <h2 class="text-2xl font-medium">Načítáte zálohu...</h2>
                    <h3>{{zaloha.datum}}</h3>
                </div>
    
                <h3>Jakým způsobem by se měla načíst?</h3>
                <div class="flex gap-3 items-center text-xl">
                    <input type="radio" name="importType" id="">
                    <label for="">Sloučit dohromady</label>
                </div>
                <div class="flex gap-3 items-center text-xl">
                    <input type="radio" name="importType" id="">
                    <label for="">Použít jen nové</label>
                </div>
                <footer class="grid grid-cols-2 gap-4">
                    <button class="border-2 border-black" @click="close">Zrušit</button>
                    <button class="bg-geo-400" @click="pouzitZalohu">Použít</button>
                </footer>
            </div>
            <div class="grid grid-cols-2 w-48">
                <span>Jméno</span>
                <span>Sekce</span>
                <div v-for="keska in zaloha.data">
                    <span>{{ keska.jmeno }}</span>
                </div>
            </div>
        </div>
    </dialog>
</template>

<style>

input[name='importType'] {
    @apply rounded-full bg-geo-50 relative appearance-none w-5 h-5 border-geo-400 border-2
}
input[name='importType']:checked::after {
    @apply content-[''] absolute rounded-full bg-geo-400 w-3 h-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
}

</style>
