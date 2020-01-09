<template>
  <div class="home">
    <h3>Geräteübersicht</h3>
    <div v-if="ids.length > 0" class="grid">
      <div
        v-for="d in ids"
        :key="d"
        class="grid-item"
        :class="{ ready: isWaiting(d), charging: !isWaiting(d) }"
        @click="goTo(d)"
      >
        <h4>Ladestation</h4>
        {{ d }}
      </div>
    </div>
    <div v-else>
      <h3>Laden...</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      ids: [],
      devices: []
    }
  },
  mqtt: {
    'energie/wallboxStatus': function (val) {
      const parse = JSON.parse(val.toString())
      console.log(parse)
      if (parse) {
        this.ids = Object.keys(parse)
        this.devices = parse
      }
    },
    'energie/solar/now': function (val) {
      const parse = JSON.parse(val.toString())
      console.log(parse)
    },
    'energie/solar/today': function (val) {
      const parse = JSON.parse(val.toString())
      console.log(parse)
    }
  },
  methods: {
    isWaiting (id) {
      return this.devices[id].state === 1
    },
    goTo (id) {
      this.$router.push(`/${id}`)
    },
    setIds (val) {
      this.ids = val
    }
  },
  mounted () {
    this.$mqtt.subscribe('energie/solar/today')
    this.$mqtt.subscribe('energie/solar/now')
    this.$mqtt.subscribe('energie/wallboxStatus')
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-gap: 12px;
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
