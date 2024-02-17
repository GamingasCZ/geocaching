import { XMLParser } from "fast-xml-parser";
import Barvy from "./assety/barvyKesek";
import summonNotif from "./komponenty/ostatni/summonNotif";
import Vzdalenost from "node-geo-distance";

export interface IntKeska {
    jmeno: string;
    zakladatel: string;
    kod: string;
    druh: string;
    obtiznost: number;
    teren: number;
    waypointy: Waypoint[];
    latitude: number;
    longtitude: number;
    napoveda: string;
    barva: string;
    url: string;
    datumVlozeni: number;
    vzdalenost?: string;
}

export interface Waypoint {
    jmeno: string;
    latitude: number;
    longitude: number;
    editing: boolean;
}

export interface Sekce {
    jmeno: string;
    barva: string;
}

export const VYCHOZI_SEKCE = [
    {
        jmeno: "Nenalezené",
        barva: Barvy.tradicni
    },
    {
        jmeno: "Nalezené",
        barva: Barvy.multi
    }
]

export const makeSectionArray = (): IntKeska[][] => {
    let arr: IntKeska[][] = []
    for (let i = 0; i < VYCHOZI_SEKCE.length; i++) arr.push([])
    return arr
}

export const hasLocalStorage = () => {
    try {
        if (localStorage) return true
        else return false;
    }
    catch (e) {
        return false
    }
}

export const getVzdalenost = (currPoloha: object, lat: number, lon: number) => {
    let polohaKesky = {latitude: lat, longitude: lon}
    return parseDistance(parseFloat(Vzdalenost.vincentySync(currPoloha, polohaKesky)))
}

export const refreshList = () => {
    if (hasLocalStorage()) {
        return [
            JSON.parse(localStorage.getItem("nastenka")!) ?? makeSectionArray(),
            JSON.parse(localStorage.getItem("sekce")!) ?? VYCHOZI_SEKCE
        ]
    }
    else return [makeSectionArray(), []]
}

export async function handleDrop(gpxData: FileList, sekce: number) {
    if (!hasLocalStorage()) return
    
    let parser = new XMLParser({ignoreAttributes: false})
    let allCaches = JSON.parse(localStorage.getItem("nastenka")!) ?? makeSectionArray()

    for (let i = 0; i < gpxData.length; i++) {
        let parsedCache;
        try {
            parsedCache = parser.parse(await gpxData.item(i)?.text())
            if (parsedCache.gpx == undefined) throw new Error("Neni keska");
        } catch (e) {
            summonNotif("Některý ze souborů není keška!")
            return
        }
        
        let kesData;
        let waypointy: Waypoint[] = []
        if (parsedCache.gpx.wpt.length > 1) {
            kesData = parsedCache.gpx.wpt[0]
            parsedCache.gpx.wpt.slice(1).forEach(waypoint => {
                waypointy.push({
                    jmeno: waypoint.cmt,
                    latitude: waypoint["@_lat"],
                    longitude: waypoint["@_lon"],
                    editing: false
                })
            });
        }
        else kesData = parsedCache.gpx.wpt
        
        let typKese: string
        switch (kesData.type) {
            case "Geocache|Traditional Cache":
                typKese = "tradicni"; break;
            case "Geocache|Multi-cache":
                typKese = "multi"; break;
            case "Geocache|Unknown Cache":
                typKese = "mystery"; break;
            case "Geocache|Earthcache":
                typKese = "earth"; break;
            case "Geocache|Virtual Cache":
                typKese = "virtual"; break;
            case "Geocache|Event Cache":
                typKese = "event"; break;
            default:
                typKese = "jina"; break;
        }

        let keska: IntKeska = {
            zakladatel: kesData['groundspeak:cache']['groundspeak:owner']['#text'],
            jmeno: kesData['groundspeak:cache']['groundspeak:name'],
            kod: kesData.name,
            druh: typKese,
            obtiznost: kesData['groundspeak:cache']['groundspeak:difficulty'], // DODělat
            teren: kesData['groundspeak:cache']['groundspeak:terrain'], // DODělat
            datumVlozeni: Date.now(),
            url: kesData.url,
            waypointy: waypointy,
            napoveda: kesData['groundspeak:cache']['groundspeak:encoded_hints'],
            latitude: parseFloat(kesData['@_lat']),
            longtitude: parseFloat(kesData['@_lon']),
            barva: Barvy[typKese],
        }
        
        // let platnaKeska = Object.values(keska).includes(undefined)
        // if (!platnaKeska) return false;
        allCaches[sekce].push(keska)
    }
    localStorage.setItem("nastenka", JSON.stringify(allCaches))
}

export const parseDistance = (distMeters: number) => {
    switch (true) {
        case distMeters >= 10000:
            return `${(distMeters/1000).toFixed(1)}km`; break;
        case distMeters >= 1000:
            return `${(distMeters/1000).toFixed(3)}km`; break;
        case distMeters >= 100:
            return `${distMeters.toFixed(0)}m`; break;
        case distMeters >= 10:
            return `${distMeters.toFixed(1)}m`; break;
        case distMeters < 10:
            return `${distMeters.toFixed(2)}m`; break;
        default:
            return `${distMeters.toFixed(0)}m`; break;
    }
}
