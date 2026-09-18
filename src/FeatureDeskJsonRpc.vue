<script setup lang="ts">
import { CarmentisJsonRpcPopup } from '@cmts-dev/carmentis-desk-connect-vuejs'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import { ref, computed } from 'vue'
import { useOperatorApi } from '@/stores/operator-api.ts'
import { storeToRefs } from 'pinia'

const store = useOperatorApi()
const { state } = storeToRefs(store)

const relayUrl = ref('https://relay.testnet.carmentis.io')
const showPopup = ref(false)
const response = ref<any>(null)
const error = ref<string | null>(null)

const defaultRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'ping',
  params: {},
}

const requestText = ref(JSON.stringify(defaultRequest, null, 2))
const parseError = ref<string | null>(null)

const parsedRequest = computed(() => {
  try {
    const parsed = JSON.parse(requestText.value)
    parseError.value = null
    return parsed
  } catch (e: any) {
    parseError.value = e.message
    return null
  }
})

function sendRequest() {
  if (!parsedRequest.value) return
  response.value = null
  error.value = null
  showPopup.value = true
}

function handleResponse(resp: any) {
  response.value = resp
  showPopup.value = false
}

function handleError(err: Error) {
  error.value = err.message
  showPopup.value = false
}
</script>

<template>
  <h1>Desk JSON-RPC</h1>
  <p>Relay: {{ relayUrl }}</p>

  <div class="field">
    <label for="rpc-request">JSON-RPC Request</label>
    <Textarea
      id="rpc-request"
      v-model="requestText"
      rows="10"
      style="width: 100%; font-family: monospace"
    />
    <small v-if="parseError" style="color: red">Invalid JSON: {{ parseError }}</small>
  </div>

  <Button @click="sendRequest" :disabled="!parsedRequest || showPopup">Send to Desk</Button>

  <CarmentisJsonRpcPopup
    v-if="showPopup"
    :visible="showPopup"
    :relay-url="relayUrl"
    :request="parsedRequest"
    title="Desk JSON-RPC"
    @disconnected="showPopup = false"
    @close-requested="showPopup = false"
    @response="handleResponse"
    @error="handleError"
  />

  <div v-if="response" class="response-block">
    <h3>Response</h3>
    <pre class="response-output">{{ JSON.stringify(response, null, 2) }}</pre>
  </div>

  <div v-if="error" class="response-block error-block">
    <h3>Error</h3>
    <pre class="response-output">{{ error }}</pre>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.response-block {
  margin-top: 1.5rem;
}

.response-output {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-block .response-output {
  border-color: #ffcccc;
  color: #cc0000;
}
</style>
