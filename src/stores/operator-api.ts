import { defineStore } from 'pinia'
import { useLocalStorage, useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

interface OperatorApiState {
  apiKey: string | undefined,
  endpoint: string | undefined
}

export const useOperatorApi = defineStore('operator-api', () => {
  const isRequestRunning = ref(false);
  const state = useStorage<OperatorApiState>("operator-api-config", {
    apiKey: undefined,
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


  return {
    isApiKeyDefined,
    isEndpointDefined,
    state: state,

    // client state
    isRequestRunning,

    // Operator API
    publicHelloWorld,
    organizationList,
  }
})
