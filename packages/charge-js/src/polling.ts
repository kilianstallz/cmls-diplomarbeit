// ===========================================
// Poller
// ===========================================
import { EventEmitter } from 'events'

export class Poller extends EventEmitter {
  timeout
  constructor(timeout = 100) {
    super()
    this.timeout = timeout
  }

  poll() {
    setTimeout(() => this.emit('poll'), this.timeout)
  }

  onPoll(cb) {
    this.on('poll', cb)
  }
}
