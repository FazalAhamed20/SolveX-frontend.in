export type userReducerInitial = {
    loading: boolean;
    err: boolean | string;
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: null | any;
    message?: string;
    status?: string;
  };
  
  export interface ErrorPayload {
    message: string;
  }