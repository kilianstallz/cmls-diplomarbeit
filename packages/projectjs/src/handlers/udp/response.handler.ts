import { store } from "../../server";
import { VirtualTimeScheduler } from "rxjs";

interface UDPResponse {
    serial?: string
    sec?: number
    /** @description 0/1 Not Ready; 2 Ready but waiting; 3 Charging; 4 Error; 5 Temperature Interrupt */
    state?: number
    error1?: any
    error2?: any
    plug?: any
    maxCurr?: any
    maxCurrPerc?: any
    output?: any
    U1?: string
    U2?: string
    U3?: string
    I1?: string
    I2?: string
    I3?: string
}

export function writeMap(data: any) {
    // Get the value Map
    let valueMap = store.get('valueMap') || {}
    valueMap[data.serial] = {...valueMap[data.serial], ...data}
    store.put('valueMap', valueMap)
}

/**
 * @param res Pass the parsed response Object from the udp observer
 * @description Parses the response object into a new format and 
 */
export function udpResponseHandler(res: any) {
    switch (res.ID) {
        case '2':
            const {State, Error1, Error2, Plug, Setenergy, Output, Input } = res
            writeMap({
                serial: res['Serial'],
                state: State,
                error1: Error1,
                error2: Error2,
                plug: Plug,
                setEnergy: Setenergy,
                output: Output,
                input: Input,
                maxCurrent: res['Max curr'],
                maxCurrentPerc: res['Max curr %'],
                currentFS: res['Curr FS'],
                currentHW: res['Curr HW'],
                currentUser: res['Curr user'],
                tmoFS: res['Tmo FS'],
                tmoCT: res['Tmo CT'],
                currentTimer: res['Curr timer'],
            })
            break;
        case '3':
            const {U1, U2, U3, I1,I2,I3,P,PF} = res
            writeMap({
                serial: res['Serial'],
                U1, U2,U3,I1,I2,I3,P,PF,
                ePres: res['E pres'],
                etotal: res['E total'],
            })
            break;
    }
}