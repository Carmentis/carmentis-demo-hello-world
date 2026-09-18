<script setup lang="ts">
import { CarmentisJsonRpcPopup } from '@cmts-dev/carmentis-desk-connect-vuejs'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AutoComplete from 'primevue/autocomplete'
import { ref, computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { jsonRpcTemplates, type JsonRpcTemplate } from '@/data/json-rpc-templates'

const relayUrl = ref('https://relay.testnet.carmentis.io')
const showPopup = ref(false)
const response = ref<unknown>(null)
const error = ref<string | null>(null)
const isLoading = ref(false)

const defaultRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'ping',
  params: {},
}

const requestText = ref(JSON.stringify(defaultRequest, null, 2))
const selectedTemplate = ref<JsonRpcTemplate | null>(null)
const templateSearchText = ref('')

const filteredTemplates = computed(() => {
  if (!templateSearchText.value) return jsonRpcTemplates
  const search = templateSearchText.value.toLowerCase()
  return jsonRpcTemplates.filter(
    (t) =>
      t.title.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search),
  )
})

const parsedRequest = computed(() => {
  try {
    const parsed = JSON.parse(requestText.value)
    return { success: true, data: parsed, error: null }
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e)
    return { success: false, data: null, error: errorMsg }
  }
})

const parseError = computed(() => {
  return parsedRequest.value.success ? null : parsedRequest.value.error
})

const validRequest = computed(() => {
  return parsedRequest.value.success ? parsedRequest.value.data : null
})

function onTemplateSelect(template: JsonRpcTemplate) {
  selectedTemplate.value = template
  requestText.value = JSON.stringify(template.request, null, 2)
  templateSearchText.value = ''
}

function sendRequest() {
  if (!validRequest.value || isLoading.value) return
  response.value = null
  error.value = null
  isLoading.value = true
  showPopup.value = true
}

function handleResponse(resp: unknown) {
  response.value = resp
  isLoading.value = false
  showPopup.value = false
}

function handleError(err: Error) {
  error.value = err.message
  isLoading.value = false
  showPopup.value = false
}

const extensions = [json()]
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>JSON-RPC Playground</h1>
      <p class="description">
        Test and debug JSON-RPC requests to Carmentis Desk. Select a pre-built template or write your own request,
        choose your relay endpoint, and instantly see the response.
      </p>
    </div>

    <div class="relay-section">
      <label for="relay-url">Relay</label>
      <InputText id="relay-url" v-model="relayUrl" type="text" class="relay-input" />
    </div>

    <div class="main-layout">
      <div class="request-column">
        <div class="section-header">Request</div>
        <div class="editor-wrapper">
          <Codemirror
            v-model="requestText"
            :extensions="extensions"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            class="editor"
          />
        </div>
        <div v-if="parseError" class="parse-error">
          <strong>Invalid JSON:</strong> {{ parseError }}
        </div>
      </div>

      <div class="response-column">
        <div class="section-header">Response</div>
        <div class="response-viewer">
          <template v-if="response">
            <pre class="response-output">{{ JSON.stringify(response, null, 2) }}</pre>
          </template>
          <template v-else-if="error">
            <div class="error-message">
              <strong>Error:</strong>
              <pre class="error-detail">{{ error }}</pre>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">No response yet.</div>
          </template>
        </div>
      </div>
    </div>

    <div class="controls">
      <AutoComplete
        :model-value="selectedTemplate"
        :suggestions="filteredTemplates"
        @update:model-value="(value) => value && onTemplateSelect(value)"
        @complete="(event) => (templateSearchText = event.query)"
        :min-length="0"
        placeholder="Select a template..."
        option-label="title"
        class="template-autocomplete"
        :show-empty-message="false"
      >
        <template #option="slotProps">
          <div class="template-option">
            <div class="template-title">{{ slotProps.option.title }}</div>
            <div class="template-description">{{ slotProps.option.description }}</div>
          </div>
        </template>
      </AutoComplete>

      <Button
        @click="sendRequest"
        :disabled="!validRequest || isLoading"
        :loading="isLoading"
        icon="pi pi-send"
      >
        Send
      </Button>
    </div>

    <CarmentisJsonRpcPopup
      v-if="showPopup"
      :visible="showPopup"
      :relay-url="relayUrl"
      :request="validRequest"
      title="JSON-RPC Playground"
      @disconnected="showPopup = false"
      @close-requested="showPopup = false"
      @response="handleResponse"
      @error="handleError"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  margin-bottom: 0.5rem;
}

h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
}

.description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-color-secondary);
  line-height: 1.5;
  max-width: 600px;
}

.relay-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.relay-section label {
  font-weight: 500;
  font-size: 0.875rem;
}

.relay-input {
  width: 100%;
  max-width: 500px;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  min-height: 400px;
}

.request-column,
.response-column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color);
}

.editor-wrapper {
  flex: 1;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--surface-card);
}

:deep(.cm-editor) {
  height: 100%;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
}

.parse-error {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #dc2626;
  font-size: 0.875rem;
}

.response-viewer {
  flex: 1;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.response-output {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.empty-state {
  padding: 2rem;
  color: var(--text-color-secondary);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.error-message {
  padding: 1rem;
  color: #dc2626;
}

.error-detail {
  margin: 0.5rem 0 0 0;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
  overflow-x: auto;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.template-autocomplete {
  flex: 0 1 300px;
}

:deep(.template-autocomplete.p-autocomplete) {
  width: 100%;
}

.template-option,
.template-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0;
}

.template-title {
  font-weight: 500;
  font-size: 0.9rem;
}

.template-description {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .request-column,
  .response-column {
    min-height: 300px;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .template-autocomplete {
    flex: 1;
  }
}
</style>
