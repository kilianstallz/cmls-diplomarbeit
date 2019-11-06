import dgram from 'dgram'

const socket = dgram.createSocket('udp4')

socket.on('message', (msg, rinfo) => {
  console.log(`${rinfo.address}:${rinfo.port} - ${msg.toString()}`)

})
socket.on('error', err => {console.error(err)})

socket.bind(7090)

function handler({address, port, msg}) {
  switch(msg.toString()) {
    case 'report 1':
      break
  }
}

function encode(payload) {
  const stringData = JSON.stringify(payload)
  const buffer = Buffer.from(stringData)
  return buffer
}