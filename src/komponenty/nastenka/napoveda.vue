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
            <header>Nápověda</header>
            <button class="px-2 text-2xl text-black bg-ext-red" @click="close">X</button>
        </div>
        <div class="p-2 bg-geo-300">
            <h2 class="mt-2 text-2xl font-bold">K čemu je nástěnka</h2>
            <p class="pl-3">Nástěnka slouží k organizaci vašich stažených kešek. Dokáže kešky zobrazit i na mapě.</p>

            <h2 class="mt-2 text-2xl font-bold">Jak používat nástěnku</h2>
            <p class="pl-3">
                Kešky se nahrávají ze souborů .gpx, stažených z Geocaching.com. Soubory můžete přidat buď tlačítkem <b>"Přidat
                kešky"</b>, nebo <b>přetáhnutím</b> do prohlížeče. Data se ukládají lokálně v prohlížeči, tzn. nikam se neposílají.
                <br />
                Keškám lze přetahováním libovolně <b>přeskladávat</b>, nebo <b>přesouvat</b> mezi sekcemi. Držením klávesy CTRL můžete vybrat
                více kešek naráz.
                
                <br />
                Kliknutím mezi na + mezi sekcemi můžete přidat 3. sekci.
            </p>
            <h2 class="mt-2 text-2xl font-bold">Import / Export</h2>
            <p class="pl-3">Uložené kešky se mohou <b>ztratit</b>, pokud v prohlížeči smažete cookies či data stránky. Před jejich smazáním byste
                neměli zapomenout zazálohovat svá data <b>exportem</b>. Pomocí importu je můžete nahrát zpět. Tímto také můžete kešky
                přesouvat mezi prohlížečí, nebo i zařízeními. Při importování je možné nastavit, jak by se měly kešky
            slučovat.</p>
        </div>
    </dialog>
</template>