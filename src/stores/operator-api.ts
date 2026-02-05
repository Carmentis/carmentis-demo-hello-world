import { defineStore } from 'pinia'
import { useLocalStorage, useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { useToast } from 'primevue'

interface OperatorApiState {
  apiKey: string | undefined,
  endpoint: string | undefined
}

export const useOperatorApi = defineStore('operator-api', () => {
  const isRequestRunning = ref(false);
  const toast = useToast();
  const state = useStorage<OperatorApiState>("operator-api-config", {
    apiKey: import.meta.env.VUE_OPERATOR_API_KEY ?? undefined,
    endpoint: undefined
  });


  const client = computed<AxiosInstance | undefined>(() => {
    if (state.value.apiKey === undefined || state.value.endpoint === undefined) {
      return undefined
    }
    return axios.create({
      baseURL: state.value.endpoint + '/api',
      headers: {
        Authorization: `Bearer ${state.value.apiKey}`
      }
    })
  })

  function isApiKeyDefined(): boolean {
    const apiKey = state.value.apiKey
    return apiKey !== undefined && apiKey.length > 0
  }

  function isEndpointDefined(): boolean {
    const endpoint = state.value.endpoint;
    return endpoint !== undefined && endpoint.length > 0
  }


  async function publicHelloWorld() {
    try {
      isRequestRunning.value = true;
      if (client.value === undefined) throw new Error("Client is not initialized");
      const response = await client.value?.get("/public/hello");
      return response.data;
    } finally {
      isRequestRunning.value = false;
    }
  }

  async function organizationList() {
    try {
      isRequestRunning.value = true
      if (client.value === undefined) throw new Error('Client is not initialized')
      const response = await client.value?.get('/organization')
      return response.data
    } finally {
      isRequestRunning.value = false
    }
  }

  async function organizationTokens( orgId: number ) {
    try {
      isRequestRunning.value = true
      if (client.value === undefined) throw new Error('Client is not initialized')
      const response = await client.value?.get(`/organization/id/${orgId}/tokens`)
      return response.data
    } finally {
      isRequestRunning.value = false
    }
  }

  async function anchor( payload: object ) {

    console.log("Anchoring")
    isRequestRunning.value = true
    if (client.value === undefined) throw new Error('Client is not initialized')
    const response = await client.value?.post('/anchor', payload)
    console.log("Receiving data:", response.data)
    isRequestRunning.value = false
    return response.data
  }

  async function getAnchorRequestById(anchorRequestId: string) {
    isRequestRunning.value = true
    if (client.value === undefined) throw new Error('Client is not initialized')
    const response = await client.value?.get(`/anchorRequest/${anchorRequestId}`)
    console.log('Receiving data:', response.data)
    isRequestRunning.value = false
    return response.data
  }


  return {
    isApiKeyDefined,
    isEndpointDefined,
    state: state,

    // client state
    isRequestRunning,

    // Operator API
    publicHelloWorld,
    organizationList,
    organizationTokens,
    anchor,
    getAnchorRequestById,
  }
})
