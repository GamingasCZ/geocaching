import { XMLParser } from "fast-xml-parser";
import Barvy from "./assety/barvyKesek";

export interface IntKeska {
    sekce: 0 | 1 | 2;
    jmeno: string;
    zakladatel: string;
    kod: string;
    druh: string;
    obtiznost: number;
    teren: number;
    pocetWaypointu: number;
    latitude: number;
    longtitude: number;
    barva: string;
    url: string;
    datumVlozeni: number;
}

export interface Sekce {
    jmeno: string;
    barva: string;
}

const VYCHOZI_SEKCE = [
    {
        jmeno: "Nenalezené",
        barva: Barvy.tradicni
    },
    {
        jmeno: "Nalezené",
        barva: Barvy.multi
    }
]

export const hasLocalStorage = () => {
    try {
        if (localStorage) return true
        else return false;
    }
    catch (e) {
        return false
    }
}

export const refreshList = () => {
    if (hasLocalStorage()) {
        return [
            JSON.parse(localStorage.getItem("nastenka")!) ?? [],
            JSON.parse(localStorage.getItem("sekce")!) ?? VYCHOZI_SEKCE
        ]
    }
    else return [[], []]
}

export async function handleDrop(gpxData: string) {
    if (!hasLocalStorage()) return
    
    let parser = new XMLParser()
    let parsedCache = parser.parse(gpxData)
    
    let kesData
    if (parsedCache.gpx.wpt.length > 1) kesData = parsedCache.gpx.wpt[0]
    else kesData = parsedCache.gpx.wpt
    
    let typKese: string
    switch (kesData.type) {
        case "Geocache|Traditional Cache":
            typKese = "tradicni"; break;
        case "Geocache|Multi-cache":
            typKese = "multi"; break;
        default:
            typKese = "jina"; break;
    }
    
    let keska: IntKeska = {
        sekce: 0,
        jmeno: kesData['groundspeak:cache']['groundspeak:name'],
        zakladatel: kesData['groundspeak:cache']['groundspeak:owner'],
        kod: kesData.name,
        druh: typKese,
        obtiznost: kesData['groundspeak:cache']['groundspeak:difficulty'], // DODělat
        teren: kesData['groundspeak:cache']['groundspeak:terrain'], // DODělat
        datumVlozeni: Date.now(),
        url: kesData.url,
        pocetWaypointu: parsedCache.gpx.wpt.length,
        latitude: 0.1,
        longtitude: 0.1,
        barva: Barvy[typKese],
    }
    
    let platnaKeska = !Object.values(keska).includes(undefined)
    if (!platnaKeska) return false;

    let allCaches = JSON.parse(localStorage.getItem("nastenka")!) ?? []
    allCaches.push(keska)
    localStorage.setItem("nastenka", JSON.stringify(allCaches))
}
