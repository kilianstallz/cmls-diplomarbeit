<template>
  <div id="q-app">
    <q-layout>
      <q-header>
        <q-toolbar></q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <div v-if="devices">
            <h5>Deine Geräte</h5>
            <div class="flex column">
              <span v-for="d in devices" :key="d" @click="selected = d" class="cursor-pointer">{{d}}</span>
            </div>
          </div>
          <div v-else>
            <q-spinner size="32px" color="black"></q-spinner>
          </div>
          <div v-if="selected" class="q-my-md q-pa-md bg-grey-4">
            <b>#{{latest[selected].Serial}}</b> - {{latest[selected].currentState.State === 0 ? 'Frei' : 'Lädt'}}
            <br />
            <br />
            Output: {{latest[selected].currentState.Output}}
            <br />
            Max. Current: {{latest[selected].currentState.MaxCurr}}
            <br/>
            Auth: {{latest[selected].currentState.AuthON}}
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      fetch: [],
      latest: null,
      selected: null,
    }
  },
  computed: {
    devices() {
      if(this.latest) {
        return Object.keys(this.latest)
      } else {
        return null
      }
    }
  },
  methods: {
    toLocalStore(data) {
      localStorage.setItem('data', data)
      this.fetch.push(data)
      this.latest = data
    }
  },
  mounted() {
    this.$io.on('connect', () => {
      console.log('connected')
    })
    this.$io.on('message', data => {
      console.log('MSG', data)
      this.toLocalStore(data)
    })
  }
};
</script>
