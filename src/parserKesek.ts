import { XMLParser } from "fast-xml-parser";
import Barvy from "./assety/barvyKesek";
import summonNotif from "./komponenty/ostatni/summonNotif";
import Vzdalenost from "node-geo-distance";
import { i18n } from "./locales";

export interface IntKeska {
    jmeno: string;
    zakladatel: string;
    kod: string;
    druh: number;
    obtiznost: number;
    teren: number;
    waypointy: Waypoint[];
    latitude: number;
    longtitude: number;
    napoveda: string;
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
        jmeno: i18n.global.t('nast.undiscovered'),
        barva: Barvy[0]
    },
    {
        jmeno: i18n.global.t('nast.found'),
        barva: Barvy[1]
    }
]

export const DRUHY_KESEK = [
    i18n.global.t("nast.traditional"),
    i18n.global.t("nast.multi"),
    i18n.global.t("nast.mystery"),
    i18n.global.t("nast.earth"),
    i18n.global.t("nast.virtual"),
    i18n.global.t("nast.event"),
    i18n.global.t("nast.other")
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
            summonNotif(i18n.global.t('nast.notACache'))
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
        
        let typKese: number
        switch (kesData.type) {
            case "Geocache|Traditional Cache":
                typKese = 0; break;
            case "Geocache|Multi-cache":
                typKese = 1; break;
            case "Geocache|Unknown Cache":
                typKese = 2; break;
            case "Geocache|Earthcache":
                typKese = 3; break;
            case "Geocache|Virtual Cache":
                typKese = 4; break;
            case "Geocache|Event Cache":
                typKese = 5; break;
            default:
                typKese = 0; break;
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
            return `${(distMeters/1000).toFixed(2)}km`; break;
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
