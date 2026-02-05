<script setup lang="ts">
import Card from 'primevue/card'
import { computed, ref } from 'vue'
import { useToast } from 'primevue'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useOperatorApi } from '@/stores/operator-api.ts'
import { storeToRefs } from 'pinia'

const toast = useToast()
const store = useOperatorApi()
const { isRequestRunning } = storeToRefs(store)

const jsonObjectToPublish = ref<string>(JSON.stringify({ example: 'test' }))
const jsonObjectToDisplay = computed(() => {
  try {
    const object = JSON.parse(jsonObjectToPublish.value)
    return JSON.stringify(object, null, 2)
  } catch (e) {
    return undefined
  }
})

const extendedPayload = computed(() => {
  let data = { data: 'example' }
  try {
    data = JSON.parse(jsonObjectToPublish.value)
  } catch {}
  return {
    channels: [
      {
        name: 'myPublicChannel',
        public: true,
      },
    ],
    actors: [
      {
        name: 'MyOperator',
      },
    ],
    data,
    channelAssignations: [
      {
        channelName: 'myPublicChannel',
        fieldPath: 'this.*',
      },
    ],
    actorAssignations: [],
    author: 'MyOperator',
  }
})
const formattedExtendedPayload = computed(() => JSON.stringify(extendedPayload.value, null, 2))

const isValidJson = computed(() => {
  return jsonObjectToDisplay.value !== undefined
})

const publishedAnchorRequestId = ref<string | undefined>(undefined)
async function publish() {
  console.log('publishing')
  try {
    const { anchorRequestId } = await store.anchor(extendedPayload.value)
    console.log('Received anchorRequestId', anchorRequestId)
    publishedAnchorRequestId.value = anchorRequestId
    toast.add({
      severity: 'success',
      summary: 'Anchor successful',
      detail: 'The transaction has been successfully submitted to the blockchain',
    })
  } catch (e) {
    console.error(`error: ${e}`)
    toast.add({ severity: 'error', summary: 'Anchor error', detail: e.message })
  } finally {
  }
}

const anchorRequestResponse = ref()
const virtualBlockchainId = computed(() => anchorRequestResponse.value?.virtualBlockchainId)
const publishedMicroblockHash = computed(() => anchorRequestResponse.value?.publishedMicroblockHash)
const formattedAnchorRequestResponse = computed(() =>
  JSON.stringify(anchorRequestResponse.value, null, 2),
)

async function checkStatus() {
  if (!publishedAnchorRequestId.value)
    return toast.add({
      severity: 'error',
      summary: 'No anchor request ID',
      detail: 'No anchor request ID has been found',
    })
  try {
    anchorRequestResponse.value = await store.getAnchorRequestById(publishedAnchorRequestId.value)
  } catch (e) {
    console.error(`error: ${e}`)
    toast.add({ severity: 'error', summary: 'Get anchor request error', detail: e.message })
  } finally {
  }
}
</script>

<template>
  <Card class="anchor-card">
    <template #title>Anchor Data</template>
    <template #content>
      <div class="anchor-content">
        <!-- Input Section -->
        <div class="section">
          <label class="label">Data to Anchor</label>
          <p class="description">
            Enter the JSON data you want to anchor on the blockchain. This data will be immutably stored and timestamped.
          </p>
          <Textarea
            v-model="jsonObjectToPublish"
            :class="{ 'invalid': !isValidJson }"
            rows="6"
            class="input-area"
          />
          <div class="validation-message">
            <span v-if="isValidJson" class="valid">✓ Valid JSON</span>
            <span v-else class="invalid">✗ Invalid JSON format - please correct your input</span>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="section">
          <label class="label">Extended Payload Preview</label>
          <p class="description">
            This preview shows the complete payload that will be sent to the operator, including channel and actor configurations.
          </p>
          <Textarea
            v-model="formattedExtendedPayload"
            readonly
            rows="6"
            class="preview-area"
          />
        </div>

        <!-- Action Button -->
        <div class="action-section">
          <Button
            :disabled="!isValidJson || isRequestRunning"
            @click="publish"
            :loading="isRequestRunning"
            class="publish-btn"
          >
            Publish to Blockchain
          </Button>
          <p class="help-text">
            Click to submit your data to the operator for blockchain anchoring
          </p>
        </div>

        <!-- Results Section -->
        <div v-if="publishedAnchorRequestId" class="results-section">
          <div class="success-message">
            <span class="success-icon">✓</span>
            <span>Anchoring request submitted successfully</span>
          </div>

          <p class="step-description">
            Your anchoring request has been successfully submitted to the operator.
            The request ID below is unique to your operator and allows you to track the status of your request.
          </p>

          <div class="info-item">
            <label class="info-label">Request ID</label>
            <code class="info-value">{{ publishedAnchorRequestId }}</code>
          </div>

          <p class="step-description">
            Your anchoring request is now being processed by the network. This may take a few moments.
            Click the button below to check the current status of your request.
          </p>

          <Button
            label="Check Status"
            @click="checkStatus"
            :disabled="isRequestRunning"
            :loading="isRequestRunning"
            outlined
            class="check-btn"
          />

          <div v-if="anchorRequestResponse" class="response-section">
            <p class="step-description">
              Here is the complete response from the operator, showing the status and details of your anchoring request.
            </p>
            <Textarea
              v-model="formattedAnchorRequestResponse"
              readonly
              rows="8"
              class="response-area"
            />

            <div v-if="publishedMicroblockHash" class="explorer-section">
              <p class="step-description success-text">
                ✓ Your data has been successfully anchored on the blockchain!
                The details below identify where your data is stored on the network.
              </p>

              <div class="info-item">
                <label class="info-label">Microblock Hash</label>
                <code class="info-value">{{ publishedMicroblockHash }}</code>
                <p class="info-description">
                  This is the cryptographic hash of the microblock containing your data.
                  It serves as a permanent proof that your data exists on the blockchain.
                </p>
              </div>

              <div class="info-item">
                <label class="info-label">Virtual Blockchain ID</label>
                <code class="info-value">{{ virtualBlockchainId }}</code>
                <p class="info-description">
                  This identifies the specific virtual blockchain where your data has been anchored.
                </p>
              </div>

              <a
                :href="`https://explorer.testnet.carmentis.io/explorer/microblock/${publishedMicroblockHash}`"
                target="_blank"
                class="explorer-link"
              >
                <Button outlined>View on Explorer</Button>
              </a>
              <p class="help-text">
                Click to view your anchored data on the Carmentis blockchain explorer
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.anchor-card {
  max-width: 800px;
  margin: 0 auto;
}

.anchor-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
}

.description,
.step-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-color-secondary);
  margin: 0;
}

.step-description {
  padding: 0.5rem 0;
}

.step-description.success-text {
  color: var(--green-700);
  font-weight: 500;
}

.info-description {
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--text-color-secondary);
  margin: 0.25rem 0 0 0;
  font-style: italic;
}

.help-text {
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
  margin: 0.5rem 0 0 0;
  font-style: italic;
}

.input-area,
.preview-area,
.response-area {
  width: 100%;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.input-area.invalid {
  border-color: var(--red-500);
}

.preview-area {
  background-color: var(--surface-50);
}

.validation-message {
  font-size: 0.875rem;
  min-height: 1.25rem;
}

.validation-message .valid {
  color: var(--green-600);
}

.validation-message .invalid {
  color: var(--red-600);
}

.action-section {
  display: flex;
  justify-content: flex-start;
}

.publish-btn {
  min-width: 200px;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--green-50);
  border-left: 3px solid var(--green-500);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--green-700);
}

.success-icon {
  font-weight: bold;
  font-size: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-color-secondary);
  letter-spacing: 0.5px;
}

.info-value {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  padding: 0.5rem;
  background-color: var(--surface-50);
  border-radius: 4px;
  word-break: break-all;
}

.check-btn {
  align-self: flex-start;
}

.response-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.explorer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.explorer-link {
  align-self: flex-start;
  text-decoration: none;
}
</style>
