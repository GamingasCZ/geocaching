<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { IntKeska } from "@/parserKesek"

const props = defineProps<{
    open: boolean;
    zaloha: any;
}>()
const emit = defineEmits<{
    (e: "close"): void,
    (e: "updateCaches", noveKesky: Array<IntKeska[]>): void
}>()


const dialog = ref<HTMLDialogElement>()
watch(() => props.open, () => {
    dialog.value?.showModal()
})

const close = () => {
    dialog.value?.close()
}
dialog.value?.addEventListener("close", close)

const pouzitZalohu = () => {
    if (metodaImportu.value == 1) { // Použít jen nové
        localStorage.setItem("nastenka", JSON.stringify(props.zaloha.data[0]))
        localStorage.setItem("sekce", JSON.stringify(props.zaloha.data[1]))
        emit("updateCaches", props.zaloha.data[0])
    }
    else { // Sloučit dohromady
        let currentKesky: IntKeska[][] = (JSON.parse(localStorage.getItem("nastenka")!) ?? [])
        let givenKesky: IntKeska[][] = JSON.parse(JSON.stringify(props.zaloha.data[0]))
        let celkemKesky: IntKeska[][] = []
        let stringKesky: string[][] = []

        for (var x = 0; x < givenKesky.length; x++) {
            let [stringCurrent, stringGiven]:string[][][] = [[], []]
            stringCurrent[x] = (currentKesky?.[x] ?? []).map(y => JSON.stringify(y))
            stringGiven[x] = givenKesky?.[x].map(y => JSON.stringify(y))

            stringKesky.push(Array.from(new Set((stringCurrent?.[x] ?? []).concat(stringGiven[x]))))
        }

        for (let i = 0; i < stringKesky.length; i++)
            celkemKesky[i] = stringKesky[i].map(x => JSON.parse(x))
       
        localStorage.setItem("nastenka", JSON.stringify(celkemKesky))
        localStorage.setItem("sekce", JSON.stringify(props.zaloha.data[1]))
        emit("updateCaches", celkemKesky)
    }
    close()
}

const rozlozeneKesky = computed(() => {
    for (let i = 0; i < props.zaloha.data[0].length; i++) {
        let j = 0
        props.zaloha.data[0][i].forEach(_ => {
            props.zaloha.data[0][i][j].sekce = i
            j += 1
        })
    }
    return [].concat(...props.zaloha.data[0])
})

const metodaImportu = ref(-1)

</script>

<template>
    <dialog ref="dialog" class="max-w-5xl leading-relaxed text-black bg-transparent outline-none underlineThick backdrop:bg-black backdrop:bg-opacity-70 drop-shadow-sharp">
        <div class="flex justify-between">
            <header>{{ $t('nast.import') }}</header>
        </div>
        <div class="flex flex-wrap gap-5 p-8 bg-geo-300">
            <div class="flex flex-wrap gap-3 justify-between w-full">
                <div class="flex flex-col gap-3">
                    <div class="sm:mb-12">
                        <h2 class="text-2xl font-medium">{{ $t('nast.loadingBackup') }}</h2>
                        <h3 v-if="zaloha.datum != -1">{{zaloha.datum}}</h3>
                    </div>
        
                    <h3>{{ $t('nast.howLoad') }}</h3>
                    <div class="flex gap-3 items-center text-xl">
                        <input type="radio" name="importType" id="sloucit" v-model="metodaImportu" value="0">
                        <label for="sloucit">{{ $t('nast.merge') }}</label>
                    </div>
                    <div class="flex gap-3 items-center text-xl">
                        <input type="radio" name="importType" id="jenNove" v-model="metodaImportu" value="1">
                        <label for="jenNove">{{ $t('nast.onlyNew') }}</label>
                    </div>
                </div>
                <div class="overflow-y-auto pr-1 max-h-[min(16.5rem,30vh)]">
                    <table class="inline-table w-full text-xs" cellspacing="2">
                        <tr class="sticky top-0 w-80 bg-geo-400">
                            <th>{{ $t('nast.name') }}</th>
                            <th>{{ $t('nast.section') }}</th>
                        </tr>
                        <tbody class="w-full">
                            <tr v-for="(keska, index) in rozlozeneKesky" class="odd:bg-black odd:bg-opacity-30 even:bg-black even:bg-opacity-10">
                                <td class="pl-2">{{ keska.jmeno }}</td>
                                <td class="pr-2">{{ zaloha.data[1][keska.sekce].jmeno }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <footer class="grid grid-cols-2 gap-4 min-w-[6rem] w-6/12">
                <button class="border-2 border-black" @click="close">{{ $t('nast.cancel') }}</button>
                <button class="bg-geo-400 disabled:grayscale disabled:opacity-70" @click="pouzitZalohu" :disabled="metodaImportu == -1">{{ $t('nast.apply') }}</button>
            </footer>
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
