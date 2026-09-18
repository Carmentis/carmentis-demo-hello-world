export interface JsonRpcTemplate {
  id: string
  title: string
  description: string
  request: object
}

export const jsonRpcTemplates: JsonRpcTemplate[] = [
  {
    id: 'ping',
    title: 'Ping',
    description: 'Simple ping to test connection',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'ping',
      params: {},
    },
  },
  {
    id: 'get-application',
    title: 'Get Application',
    description: 'Retrieve information about an application',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getApplication',
      params: {
        applicationId: '',
      },
    },
  },
  {
    id: 'list-applications',
    title: 'List Applications',
    description: 'Get a list of all applications',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'listApplications',
      params: {},
    },
  },
  {
    id: 'get-module',
    title: 'Get Module',
    description: 'Retrieve information about a specific module',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getModule',
      params: {
        moduleId: '',
      },
    },
  },
  {
    id: 'list-modules',
    title: 'List Modules',
    description: 'Get a list of all modules',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'listModules',
      params: {},
    },
  },
  {
    id: 'create-anchor',
    title: 'Create Anchor',
    description: 'Create a new anchor with metadata',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'createAnchor',
      params: {
        metadata: {},
      },
    },
  },
  {
    id: 'get-anchor',
    title: 'Get Anchor',
    description: 'Retrieve information about a specific anchor',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getAnchor',
      params: {
        anchorId: '',
      },
    },
  },
]
