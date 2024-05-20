import { i18n } from "@/locales";
import { ref } from "vue";

export default ref([
    {
        nazev: i18n.global.t('game.krabka'),
        url: "krabka-vs-svet",
        popis: i18n.global.t('game.krabkaDesc'),
        ovladani: i18n.global.t('game.krabkaLongDesc'),
        zdroje: "",
    }
])