<script setup lang="ts">
import { useOperatorApi } from '@/stores/operator-api.ts'
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Toast from 'primevue/toast'
import { useToast } from 'primevue'
const store = useOperatorApi()

const toast = useToast()
const orgId = ref<number | undefined>(undefined)
const response = ref()
const formattedResponse = computed(() => JSON.stringify(response.value, null, 2))

async function sendRequest() {
  if (typeof orgId.value !== 'number' || false) {
    toast.add({ severity: 'error', summary: 'Invalid Organization ID', detail: 'Please enter a valid organization ID' })
  } else {
    response.value = undefined
    response.value = await store.organizationTokens(orgId.value)
  }
}
</script>

<template>
  <Toast />
  <Card>
    <template #title>Organization Tokens</template>
    <template #content>
      <InputNumber v-model="orgId" label="Organization ID" />
      <p class="description">Fetch the tokens of the organization.</p>

      <Button
        @click="sendRequest"
        :loading="store.isRequestRunning"
        icon="pi pi-list"
        label="Fetch organization tokens"
        class="action-button"
      />

      <div v-if="response" class="response-container">
        <h3>Response</h3>
        <pre class="response-output">{{ formattedResponse }}</pre>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.description {
  margin-bottom: 1.5rem;
  color: var(--p-text-muted-color);
}

.action-button {
  margin-bottom: 1.5rem;
}

.response-container {
  margin-top: 1.5rem;
}

.response-container h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.response-output {
  background: var(--p-surface-50);
  border: 1px solid var(--p-surface-200);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
