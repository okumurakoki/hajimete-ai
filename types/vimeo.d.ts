declare module '@vimeo/vimeo' {
  export interface VimeoRequestOptions {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    path: string
    query?: Record<string, any>
    data?: Record<string, any>
  }

  export interface VimeoCallback {
    (error: any, body?: any, statusCode?: number, headers?: any): void
  }

  export class Vimeo {
    constructor(clientId: string, clientSecret: string, accessToken: string)
    
    request(options: VimeoRequestOptions, callback: VimeoCallback): void
    request(options: VimeoRequestOptions): Promise<any>
  }
}