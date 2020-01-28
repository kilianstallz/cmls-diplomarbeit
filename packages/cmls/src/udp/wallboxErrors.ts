import { eventBus } from "../eventBus";
import { logger } from "../logger";
import client from "../mqtt";

eventBus.on('wallboxError', data => {
    console.error(data)
    logger.error(JSON.stringify(data))
    client.publish('energie/wallboxError', JSON.stringify(data))
})