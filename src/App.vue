<script setup lang="ts">
import { useOperatorApi } from '@/stores/operator-api.ts'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import Operations from '@/Operations.vue'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'

const operatorApi = useOperatorApi()
const { state } = storeToRefs(operatorApi)
const message = computed(() => {
  if (!operatorApi.isEndpointDefined()) return 'Please enter your Endpoint'
  if (!operatorApi.isApiKeyDefined()) return 'Please enter your API Key'
  return 'Ready to go!'
})
const isReady = computed(() => operatorApi.isEndpointDefined() && operatorApi.isApiKeyDefined())
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Carmentis Demo</h1>
    </div>

    <Card class="config-card">
      <template #content>
        <Message :severity="isReady ? 'success' : 'info'" class="message">
          {{ message }}
        </Message>

        <div class="spacer"></div>

        <div class="form-group">
          <FloatLabel>
            <InputText id="endpoint" v-model="state.endpoint" class="input-field" />
            <label for="endpoint">Endpoint</label>
          </FloatLabel>
        </div>

        <div class="spacer"></div>

        <div class="form-group">
          <FloatLabel>
            <InputText id="apikey" v-model="state.apiKey" type="password" class="input-field" />
            <label for="apikey">API Key</label>
          </FloatLabel>
        </div>
      </template>
    </Card>

    <Operations v-if="isReady" />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 300;
  color: var(--p-text-color);
}

.config-card {
  margin-bottom: 2rem;
}

.message {
  margin-bottom: 1.5rem;
}

.spacer {
  height: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-field {
  width: 100%;
}
</style>
