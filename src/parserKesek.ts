import { XMLParser } from "fast-xml-parser";

export interface IntKeska {
    sekce: 0 | 1 | 2;
    jmeno: string;
    zakladatel: string;
    kod: string;
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

export async function handleDrop(gpxData: string) {
    if (!hasLocalStorage()) return
    
    let parser = new XMLParser()
    let parsedCache = parser.parse(gpxData)
    
    let kesData
    if (parsedCache.gpx.wpt.length > 1) kesData = parsedCache.gpx.wpt[0]
    else kesData = parsedCache.gpx.wpt
    
    let keska = {
        jmeno: kesData['groundspeak:cache']['groundspeak:name'],
        od: kesData['groundspeak:cache']['groundspeak:owner'],
        kod: kesData.name,
    }
    
    let platnaKeska = !Object.values(keska).includes(undefined)
    if (!platnaKeska) return false;

    let allCaches = JSON.parse(localStorage.getItem("nastenka")!) ?? []
    allCaches.push(keska)
    localStorage.setItem("nastenka", JSON.stringify(allCaches))
}
