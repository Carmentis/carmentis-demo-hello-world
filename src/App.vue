<script setup lang="ts">
import { useOperatorApi } from '@/stores/operator-api.ts'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import Operations from '@/Operations.vue'
import InputText from 'primevue/inputtext'

const operatorApi = useOperatorApi()
const { state } = storeToRefs(operatorApi)
const message = computed(() => {
  if (!operatorApi.isEndpointDefined()) return 'Please enter your Endpoint'
  if (!operatorApi.isApiKeyDefined()) return 'Please enter your API Key'
  return 'Ready to go!'
})
</script>

<template>
  {{ message }}


  <InputText type="text" placeholder="Endpoint" v-model="state.endpoint" />
  <InputText type="text" placeholder="API Key" v-model="state.apiKey" />
  <Operations v-if="operatorApi.isEndpointDefined() && operatorApi.isApiKeyDefined()" />
</template>

<style scoped></style>
