<template>
  <div class="home">
    <h2>Ladestationen</h2>
    <div v-if="ids.length > 0" class="grid">
      <div
        v-for="d in ids"
        :key="d"
        class="grid-item"
        :class="{ ready: !isCharging(d), charging: isCharging(d) }"
        @click="goTo(d)"
      >
        <h4 style="margin-bottom: 6px;">Ladestation {{ d }}</h4>
        <div>
          {{ isCharging(d) ? "Laden" : "Frei" }}
        </div>
        <div>
          <div>
            {{ devices[d].I1/1000 }}A {{ devices[d].I2/1000 }}A {{ devices[d].I3/1000 }}A
          </div>
          <div>{{ parseInt(devices[d].P)/1000 }}W</div>
          <div>
            {{ devices[d].U1 }}V {{ devices[d].U2 }}V {{ devices[d].U3 }}V
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>Laden...</h3>
    </div>

    <div>
      <h3>Aktuelle PV-Produktion</h3>
      <div>
        <h3 v-if="PV.latest">
          {{ PV.latest }}W
        </h3>
      </div>
      <line-chart :data="pvData"></line-chart>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      ids: [],
      devices: [],
      pvData: [],
      PV: {
        latest: null,
        day: null
      }
    }
  },
  mqtt: {
    'energie/solar/current': function (val) {
      const parse = val.toString()
      console.log(parse)
      this.writePVToLocalStore(parse)
      this.readPVData()
      this.PV.latest = parseInt(parse.slice(0, -1))
    },
    'energie/wallboxMap': function (val) {
      const parse = val.toString()
      const jparse = JSON.parse(parse)
      if (jparse) {
        console.log(jparse)
        this.ids = Object.keys(jparse)
        this.devices = jparse
      }
    }
  },
  methods: {
    isCharging (id) {
      return this.devices[id].State === 3 && this.devices[id].Plug === 7
    },
    goTo (id) {
      this.$router.push(`/${id}`)
    },
    setIds (val) {
      this.ids = val
    },
    writePVToLocalStore (v) {
      let pvStore = localStorage.getItem('PV')
      if (!pvStore) {
        localStorage.setItem('PV', JSON.stringify([]))
        pvStore = localStorage.getItem('PV')
      }
      pvStore = JSON.parse(pvStore)
      pvStore.push([Date(), parseInt(v.slice(0, -1))])
      if (this.pvData.length > 300) {
        const d = this.pvData
        this.pvData = d.shift()
        pvStore = pvStore.shift()
      }
      localStorage.setItem('PV', JSON.stringify(pvStore))
    },
    async readPVData () {
      this.pvData = JSON.parse(await localStorage.getItem('PV'))
    }
  },
  mounted () {
    this.$mqtt.subscribe('energie/solar/current')
    this.$mqtt.subscribe('energie/wallboxSerials')
    this.$mqtt.subscribe('energie/wallboxMap')
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-gap: 12px;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto;
  width: 100%;

  &-item {
    width: 100%;
    height: auto;
    padding-bottom: 18px;
    border-radius: 4px;
    background: #ccc;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}

.charging {
  background: yellow;
  color: black;
}
.ready {
  background: greenyellow;
  color: black;
}
</style>
