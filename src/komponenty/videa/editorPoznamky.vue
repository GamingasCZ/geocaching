<script setup lang="ts">
import { hasLocalStorage } from '@/parserKesek';
import { ref } from 'vue';

const props = defineProps<{
    maxTime: string;
    time: string;
    currUrl: string;
    timeRatio: number;
}>()

const emit = defineEmits<{
    (e: "cancel"): void
    (e: "saved", allNotes: any[]): void
    (e: "changedNoteTime", allNotes: any[]): void
}>()

const form = ref()
const saveNote = (f: Event) => {
    if (!hasLocalStorage()) return
    let formData = (form.value as HTMLFormElement)
    let notes = JSON.parse(localStorage.getItem("poznamky")!) ?? []
    notes.push([
        formData.elements[0].value,
        formData.elements[1].value,
        formData.elements[2].value,
        props.currUrl,
        props.timeRatio
    ])
    console.log(notes)
    localStorage.setItem("poznamky", JSON.stringify(notes))
    emit("saved", notes)
}

</script>

<template>
    <form class="flex flex-col gap-2 p-3 m-3 bg-geo-400" ref="form" @submit.prevent="saveNote">
        <input name="name" type="text" maxlength="25" required class="p-1 font-extrabold tracking-wide text-white bg-black bg-opacity-40 placeholder:text-white placeholder:text-opacity-80" autofocus autocomplete="off" placeholder="Název poznámky">
        <textarea name="text" required maxlength="300" class="p-1 text-white bg-black bg-opacity-40 placeholder:text-white placeholder:text-opacity-80" placeholder="Text poznámky"></textarea>
        <footer class="flex justify-between items-center">
            <div>
                <span class="mr-2 font-bold">Čas:</span>
                <input name="time" required class="font-bold text-white bg-black bg-opacity-40 appearance-none" type="time" min="00:00" max="01:30" :value="time">
            </div>
            <div>
                <button type="button" class="p-1 mr-2 text-xl text-black" @click="emit('cancel')">Zrušit</button>
                <button type="submit" class="p-1 text-xl font-extrabold text-white bg-black">Uložit</button>
            </div>
        </footer>
    </form>
</template>