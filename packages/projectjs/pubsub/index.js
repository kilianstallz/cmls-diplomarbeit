import ioredis from 'ioredis'

const pubsub = new ioredis()

export {
  pubsub
}