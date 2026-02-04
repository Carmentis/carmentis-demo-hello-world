<script setup lang="ts">
import { useOperatorApi } from '@/stores/operator-api.ts'
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'

const store = useOperatorApi()

const response = ref()
const formattedResponse = computed(() => JSON.stringify(response.value, null, 2))

async function sendRequest() {
  response.value = undefined
  response.value = await store.organizationList()
}
</script>

<template>
  <Card>
    <template #title>Organizations</template>
    <template #content>
      <p class="description">List of organizations registered in your operator</p>

      <Button
        @click="sendRequest"
        :loading="store.isRequestRunning"
        icon="pi pi-list"
        label="Fetch Organizations"
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
