export type userReducerInitial = {
    loading: boolean;
    err: boolean | string;
    user: null | any;
    message?: string;
    success?:boolean;
    isUser?:Boolean;
    isAdmin?:Boolean
  
   

   
  };
  
  export interface ErrorPayload {
    message: string;
    status?:number;
    success?:boolean
    
    
    
  }