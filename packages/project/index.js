import { Application, Poller } from "@chargejs/charge";

const charge = new Application();

charge.start();

const mqttClient = charge.mqtt;
const udupClient = charge.udp;

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

const main = new Poller(5000);
const deviceMap = {};

// TODO: Get devices from config
// TODO: Do health check

main.onPoll(() => {
  // TODO: Get Devices from config
  // TODO: Get needed Data

  // Main loop
  charge.requestUDP({
    port: 7090,
    address: "192.168.0.102",
    message: "report 2S"
  });
  main.poll();
});
main.poll();
