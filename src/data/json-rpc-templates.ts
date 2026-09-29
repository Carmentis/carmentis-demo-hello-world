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
    id: 'discover',
    title: 'Discover',
    description: 'Discover methods supported by Desk',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'discover',
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
          purpose: 'Sign JSON',
        },
        payload: {
          message: 'Hello, World!',
        },
      },
    },
  },
  {
    id: 'auth-v1',
    title: 'Auth with Desk (v1) (Deprecated)',
    description: 'Ask Desk to authenticate',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: '/v1/auth/pk',
      params: {
        origin: 'Carmentis Operator',
        challenge: '1234',
        sigMethod: 'canonical-json',
      },
    },
  },
  {
    id: 'auth-v2',
    title: 'Auth with Desk (v2)',
    description: 'Ask Desk to authenticate',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: '/v2/auth/pk',
      params: {
        origin: 'Desk Playground',
        logoUrl: 'https://docs.carmentis.io/img/carmentis-logo-color.png',
        challenge: '12345',
      },
    },
  },
  {
    id: 'vp-v1',
    title: 'Presentation of Verifiable Credential (SD-JWT)',
    description: 'Ask Desk to present a Verifiable Credential',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: '/v1/credential/presentation',
      params: {
        audience: 'Test',
        nonce: '1234',
        query: {
          credentials: [
            {
              id: 'email_credential',
              format: 'vc+sd-jwt',
              claims: [{ path: ['email'] }],
            },
          ],
        },
      },
    },
  },
]
