<script setup lang="ts">
import { useOperatorApi } from '@/stores/operator-api.ts'
import { computed, ref } from 'vue'
import Button from 'primevue/button'

const store = useOperatorApi()

const response = ref()
const formattedResponse = computed(() => JSON.stringify(response.value, null, 2))

async function sendRequest() {
  response.value = undefined
  response.value = await store.organizationList()
}
</script>

<template>
  List of organizations registered in your operator
  {{ formattedResponse }}
  <Button @click="sendRequest" :loading="store.isRequestRunning">{{
    store.isRequestRunning ? 'Sending...' : 'Send'
  }}</Button>
</template>

<style scoped></style>
