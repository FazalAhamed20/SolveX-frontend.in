export type userReducerInitial = {
    loading: boolean;
    err: boolean | string;
    user: null | any;
    message?: string;
    status?: number;
   
  };
  
  export interface ErrorPayload {
    message: string;
    status?:number;
    
    
    
  }