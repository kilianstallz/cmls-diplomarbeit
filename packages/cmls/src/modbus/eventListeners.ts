import { eventBus } from "../eventBus";
import mqtt from "../mqtt";

function calculateFullProd(val: number): number {
    const smallPV = Math.round((val/12)*52) // 1 Modul der Anlage berechnen; Auf alle 52 Module hochrechnen
    const bigPV = Math.round(((val/12)*4.9)*400) // Gesamte Anlage produziert 4.9 mal mehr Leistung auf der großen Anlage -> Hochrechnen auf 400 Module
    return smallPV + bigPV
} 

eventBus.on('pvProductionCurrent', val => {
    const calc = calculateFullProd(val)
    console.log(`PV jetzt: ${calc}`)
    mqtt.publish('energie/solar/current', JSON.stringify({ value: calc }))
})

eventBus.on('pvProductionDay', val => {
    console.log(`PV Heute: ${val}`)
    mqtt.publish('energie/solar/today', JSON.stringify({ value: val }))
})