import { i18n } from "@/locales"
import { ref } from "vue"

let intro = `
<b>"I Got a Stick Arr Bryan Teoh"</b> Kevin MacLeod (<a href="https://incompetech.com">incompetech.com</a>)<br />
Licensed under Creative Commons: By Attribution 4.0 License<br />
<a href="http://creativecommons.org/licenses/by/4.0/">http://creativecommons.org/licenses/by/4.0/</a><br /><br />
<b>"Funky Chunk"</b> Kevin MacLeod (<a href="https://incompetech.com">incompetech.com</a>)<br />
Licensed under Creative Commons: By Attribution 4.0 License<br />
<a href="http://creativecommons.org/licenses/by/4.0/">http://creativecommons.org/licenses/by/4.0/</a>
`

let titles = ref([
    i18n.global.t('video.videoTitle1'),
    i18n.global.t('video.videoTitle2'),
    i18n.global.t('video.videoTitle3'),
    i18n.global.t('video.videoTitle4'),
    i18n.global.t('video.videoTitle5'),
    i18n.global.t('video.videoTitle6'),
    i18n.global.t('video.videoTitle7'),
    i18n.global.t('video.videoTitle8')
])

export default [
    {
        nazev: titles.value[0],
        link: "tULAzdH3DGE",
        url: "co-je-geocaching",
        popis: i18n.global.t('video.videoDesc1'),
        zdroje: `
${ intro }
        `,
    },
    {
        nazev: titles.value[1],
        link: "0pjrik1-7tM",
        url: "cim-hledat",
        popis: i18n.global.t('video.videoDesc2'),
        zdroje: `
${ intro }
        `,
    },
    {
        nazev: titles.value[2],
        link: "dRSXXqX-c-E",
        url: "druhy-kesek",
        popis: i18n.global.t('video.videoDesc3'),
        zdroje: `
[1] "Cache sizes | Geocaching wiki | Fandom", geocaching.fandom.com. Viděno: 20. únor 2024. [Online]. Dostupné z: https://geocaching.fandom.com/wiki/Cache_Sizes<br>
[2] "Learn about cache types", geocaching.com. Viděno: 20. únor 2024. [Online]. Dostupné z: https://www.geocaching.com/help/index.php?pg=kb.chapter&id=127<br><br>

${ intro }
        `,
    },
    {
        nazev: titles.value[3],
        link: "ELqywmgWHDM",
        url: "hledani-kesky",
        popis: i18n.global.t('video.videoDesc4'),
        zdroje: `
<b>"I Got a Stick Arr Bryan Teoh"</b> Kevin MacLeod (<a href="https://incompetech.com">incompetech.com</a>)<br />
Licensed under Creative Commons: By Attribution 4.0 License<br />
<a href="http://creativecommons.org/licenses/by/4.0/">http://creativecommons.org/licenses/by/4.0/</a><br /><br />
<b>"Adventures in Adventureland"</b> Kevin MacLeod (<a href="https://incompetech.com">incompetech.com</a>)<br />
Licensed under Creative Commons: By Attribution 4.0 License<br />
<a href="http://creativecommons.org/licenses/by/4.0/">http://creativecommons.org/licenses/by/4.0/</a><br /><br />
<b>"New Hero in Town"</b> Kevin MacLeod (<a href="https://incompetech.com">incompetech.com</a>)<br />
Licensed under Creative Commons: By Attribution 4.0 License<br />
<a href="http://creativecommons.org/licenses/by/4.0/">http://creativecommons.org/licenses/by/4.0/</a><br /><br />
<b>"Wholesome"</b> Kevin MacLeod (<a href="https://incompetech.com">incompetech.com</a>)<br />
Licensed under Creative Commons: By Attribution 4.0 License<br />
<a href="http://creativecommons.org/licenses/by/4.0/">http://creativecommons.org/licenses/by/4.0/</a>
        `,
    },
    {
        nazev: titles.value[4],
        link: "aXGEpFr2xZ0",
        url: "historie",
        popis: i18n.global.t('video.videoDesc5'),
        zdroje: `
[1] „Geocaching - Wikipedie", cs.wikipedia.org. Viděno: 20. únor 2024. [Online]. Dostupné z: https://cs.wikipedia.org/wiki/Geocaching<br>
[2] „Geocaching - Wikipedia", en.wikipedia.org. Viděno: 20. únor 2024. [Online]. Dostupné z: https://en.wikipedia.org/wiki/Geocaching<br>
[3] „Geocaching > Getting Started with Geocaching > The History of Geocaching", geocaching.com. Viděno: 20. únor 2024. [Online]. Dostupné z: https://www.geocaching.com/about/history.aspx<br><br>

${ intro }
        `,
    },
    {
        nazev: titles.value[5],
        link: "4BU7Ngu3Iq0",
        url: "travel-bugy",
        popis: i18n.global.t('video.videoDesc6'),
        zdroje: `
${ intro }
        `,
    },
    {
        nazev: titles.value[6],
        link: "YbAjKlv3Pc4",
        url: "slovnicek-pojmu",
        popis: i18n.global.t('video.videoDesc7'),
        zdroje: `
${ intro }
        `,
    },
    {
        nazev: titles.value[7],
        link: "QpxxbLYGsts",
        url: "necyklopedie",
        popis: i18n.global.t('video.videoDesc8'),
        zdroje: `
        "Sergio's Magic Dustbin " Kevin MacLeod (incompetech.com)
        Licensed under Creative Commons: By Attribution 4.0 License
        http://creativecommons.org/licenses/by/4.0/
        
        "Amazing Grace 2011" Kevin MacLeod (incompetech.com)
        Licensed under Creative Commons: By Attribution 4.0 License
        http://creativecommons.org/licenses/by/4.0/
${ intro }
        `,
    }
]
