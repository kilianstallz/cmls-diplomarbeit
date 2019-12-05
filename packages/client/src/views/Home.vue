<template>
  <div class="home">
    <h3>Geräteübersicht</h3>
    <div v-if="ids.length > 0" class="grid">
      <div v-for="d in ids" :key="d" class="grid-item" :class="{'ready': isWaiting(d), 'charging': !isWaiting(d)}" @click="goTo(d)">
        <h4>Ladestation</h4>
        {{d}}
      </div>
    </div>
    <div v-else>
      <h3>Laden...</h3>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const conn = new WebSocket('ws://localhost:3001/ws')

export default {
  name: 'home',
  data () {
    return {
      devices: [],
      ids: []
    }
  },
  methods: {
    isWaiting (id) {
      return this.devices[id].state === 0
    },
    goTo (id) {
      this.$router.push(`/${id}`)
    }
  },
  mounted () {
    let i = 0
    conn.addEventListener('message', msg => {
      if (msg.data.startsWith('{') && (i % 2 === 0)) {
        const data = JSON.parse(msg.data)
        this.devices = data
        delete data.time
        this.ids = Object.keys(data)
      }
      i++
    })
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-template-rows: auto;
  width: 100%;

  &-item {
    width: 100%;
    height: 200px;
    border-radius: 4px;
    background: #ccc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.charging {
  background: #ffccaa;
}
.ready {
  background: greenyellow;
}

</style>
