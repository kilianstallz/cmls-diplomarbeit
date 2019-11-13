import { Application } from '../../charge';
import { mqttConfigHandler } from './mqttConfigHandler';

/**
 * Handle MQTT Messages Recieved
 * @param context Application Context
 * @param topic
 * @param message
 */
export function mqttTopicHandler(context: Application, topic: string, message:string) {
  if(topic.startsWith('config')) {
    return mqttConfigHandler(topic, message)
  }
}
