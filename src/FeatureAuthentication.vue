<script setup lang="ts">
import { CarmentisAuthPopup } from '@cmts-dev/carmentis-desk-connect-vuejs'
import Button from 'primevue/button'
import { ref } from 'vue'

const relayUrl = ref('https://relay.testnet.carmentis.io')
const challenge = ref('aaaa')
const showPopup = ref(false)
</script>

<template>
  <h1>Authentication</h1>
  <p>Relay: {{relayUrl}}</p>
  <p>Challenge to sign: {{challenge}}</p>
  <CarmentisAuthPopup
    v-if="showPopup"
    :relay-url="relayUrl"
    :challenge="challenge"
    :visible="showPopup"
    @disconnected="showPopup = false"
    @close-requested="showPopup = false"
  />
  <Button @click="showPopup = true">Authenticate</Button>
</template>
