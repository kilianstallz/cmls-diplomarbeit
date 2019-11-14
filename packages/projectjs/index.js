import { Application, Poller, MQTTService, UDPService } from "@chargejs/charge"

const charge = new Application();

const udp = new UDPService()
const mqtt = new MQTTService()
const main = new Poller(5000);

charge.on("udpMessage", data => {
  let _data = data;
  if (_data.msg.startsWith("{")) {
    const { msg, rinfo } = _data;
    const _msg = JSON.parse(msg.toString());

    switch (_msg.ID) {
      case "1":
        break;
      case "2":
        deviceMap[_msg.Serial] = {
          health: "active",
          ..._msg
        };
        delete deviceMap[_msg.Serial].ID;
        mqttClient.publish('/energie', JSON.stringify(deviceMap))
        break;
    }
  } else {
    console.error(`Error: ${data.rinfo.address} ${data.msg}`);
  }
});

const deviceMap = {};

// TODO: Get devices from config
// TODO: Do health check

main.cyclic(() => {
  // TODO: Get Devices from config
  // TODO: Get needed Data

  // Main loop
  udp.requestUDP({
    port: 7090,
    address: "192.168.0.102",
    message: "report 2S"
  });
  main.poll();
});
main.poll();

charge.init()
