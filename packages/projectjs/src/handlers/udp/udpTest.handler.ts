import { Socket, RemoteInfo } from "dgram";

export function testHandler(client: Socket) {
    client.on('message', (msg, rinfo) => {
        const parse = msg.toString()
        switch(parse) {
            case 'report 1':
                client.send('{"ID": "1","Product": "KC-P30-ES240022-E0R",\n"Serial": "18871884","Firmware":"P30 v 3.9.14 (180227-111537)","COM-module": 0,\n"Backend": 0,"timeQ": 0,"Sec": 3360}', rinfo.port, rinfo.address)
                break;
            case 'report 2':
                client.send('{"ID": "2",\n"State": 0,\n"Error1": 0,"Error2": 0,"Plug": 0,"AuthON": 0,"Authreq": 0,"Enable sys": 1,"Enable user": 1,"Max curr": 0,"Max curr %": 1000,"Curr HW": 0,"Curr user": 63000,\n"Curr FS": 0,\n"Tmo FS": 0,\n"Curr timer": 0,"Tmo CT": 0,\n"Setenergy": 0,\n"Output": 0,\n"Input": 0,\n"Serial": "18871884",\n"Sec": 3478\n}\n', rinfo.port, rinfo.address)    
                break;
            case 'report 3':
                client.send('{\n"ID": "3",\n"U1": 0,\n"U2": 0,\n"U3": 0,\n"I1": 0,\n"I2": 0,\n"I3": 0,\n"P": 0,\n"PF": 0,\n"E pres": 0,\n"E total": 0,\n"Serial": "18871884",\n"Sec": 3498\n}\n', rinfo.port, rinfo.address)
                break;
        }
    })
}