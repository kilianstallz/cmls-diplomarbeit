# EventBus

Der größte Anteil an Datenfluss in der CMLS wird mit Events übertragen.
Alle Events werden auf den `eventBus` emittet. Dieser ist ein einfacher Node.JS `EventEmitter`.

## Wallboxen/UDP

### UDP_NEW_MESSAGE

In der `app.ts` File, wird eine Subscription mit dem `udp socket observable` gestartet. Bei Nachricht mit Payload, wird das Event `UDP` emittet.

`````json
{
    "type": "UDP_NEW_MESSAGE",
    "rinfo": {
        "address": "string",
        "family": "IPv4 | IPv6",
        "port": 1231,
        "size": 1235124
    },
    "isData": true | false,
    "message": "JSON message String"
}
`````

### FIRST_UPDATE

Wird emitted, wenn die CMLS das erste mal Daten vom UDP Socket erhält.

`````json
{
    "type": "FIRST_UPDATE",
    "serial": "WallboxSerial",
    "map": "...DataMap with new data"
}
`````

#### carPluggedIn

Wird emitted, wenn die CMLS eine `status` änderung registriert.
Der Status ändert sich von `enum isIdle` zu `enum isWaiting`.

`````json
{
    "serial": "WallboxSerial"
}
`````

### `sendUDP`

### CAR_PLUGGED_IN

### CAR_PLUGGED_OUT

### CAR_PLUGGED_OUT_CHARGING

### CAR_STARTED_CHARGIN
