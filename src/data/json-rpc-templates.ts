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
    id: 'sign-json-1',
    title: 'Sign JSON #1',
    description: 'Ask Desk to sign a JSON',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: '/v1/sign/json',
      params: {
        context: {
          purpose: "Sign JSON"
        },
        payload: {
          message: "Hello, World!"
        }
      },
    },
  },
]
