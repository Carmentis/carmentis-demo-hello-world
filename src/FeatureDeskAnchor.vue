<script setup lang="ts">
import { CarmentisApprovalPopup } from '@cmts-dev/carmentis-desk-connect-vuejs'
import Button from 'primevue/button'
import { ref, watch } from 'vue'
import { useOperatorApi } from '@/stores/operator-api.ts'
import { storeToRefs } from 'pinia'

const store = useOperatorApi()
const { isRequestRunning, state } = storeToRefs(store)

const relayUrl = ref('https://relay.testnet.carmentis.io')
const serverUrl = ref(state.value.endpoint)
const showPopup = ref(false)
const anchorRequestId = ref<string>('')
const isSendingAnchorRequest = ref(false)
const anchorRequest = ref({
  gasPriceInAtomics: 1,
  chainStorageInDays: 10,
  channels: [
    {
      name: 'myPublicChannel',
      public: true,
    },
    {
      name: 'myPrivateChannel',
      public: false,
    },
  ],
  actors: [{ name: 'MyOperator' }, { name: 'Demo' }, { name: 'Demo2' }, { name: 'Demo3' }],
  data: { example: 'Hello World' },
  channelAssignations: [
    {
      channelName: 'myPublicChannel',
      fieldPath: 'this.*',
    },
  ],
  actorAssignations: [],
  author: 'MyOperator',
  approvalMessage: 'Hello',
  endorser: 'Demo',
})

async function sendAnchorRequest() {
  isSendingAnchorRequest.value = true
  const { anchorRequestId: receivedAnchorRequestId } = await store.anchorWithWallet(
    anchorRequest.value,
  )
  anchorRequestId.value = receivedAnchorRequestId
  isSendingAnchorRequest.value = false
}

watch(anchorRequestId, (newAnchorRequestId) => {
  if (newAnchorRequestId) {
    showPopup.value = true
  }
})
</script>

<template>
  <h1>Desk Anchor</h1>
  <Button @click="sendAnchorRequest" :disabled="isSendingAnchorRequest"
    >Ask operator for anchor request id</Button
  >
  <p>Relay: {{ relayUrl }}</p>
  <CarmentisApprovalPopup
    v-if="showPopup"
    :visible="showPopup"
    :relay-url="relayUrl"
    :serverUrl="state.endpoint!"
    :anchor-request-id="anchorRequestId"
    @disconnected="showPopup = false"
    @close-requested="showPopup = false"
  />
  <Button @click="showPopup = true">Anchor with desk</Button>
</template>
