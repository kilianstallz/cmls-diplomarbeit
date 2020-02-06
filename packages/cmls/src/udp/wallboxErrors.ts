import { eventBus } from "../eventBus";
import {mqtt} from "../app";

eventBus.on('wallboxError', data => {
    console.error(data)
    mqtt.publish('energie/wallboxError', JSON.stringify(data))
})