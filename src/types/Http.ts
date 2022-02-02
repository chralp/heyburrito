declare module Http {

  export interface Response {
    error: boolean;
    code?: number,
    message?: string | null,
    data?: object | null
  }

}

export default Http;
