import { hasLocalStorage } from "@/parserKesek";
import { onMounted, ref, watch } from "vue";

export const Nastaveni = ref({
    zobrazeni: 0,
    zakazatPolohu: false,
    zakazatPretahovani: false
})

if (hasLocalStorage()) {
    let hasSettings = JSON.parse(localStorage.getItem("nastaveniNastenky")!)
    if (hasSettings != null)
        Nastaveni.value = hasSettings

    watch(Nastaveni, () => {
        localStorage.setItem("nastaveniNastenky", JSON.stringify(Nastaveni.value))
    }, {deep: true})
}