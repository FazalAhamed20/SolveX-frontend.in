export type userReducerInitial = {
  loading: boolean;
  err: boolean | string;
  user: null | any;
  message?: string;
  success?: boolean;
  isUser?: Boolean;
  isAdmin?: Boolean;
};
export type adminReducerInitial = {
  loading: boolean;
  err: boolean | string;
  user: null | any;
  message?: string;
  success?: boolean;
};
export type problemReducerInitial = {
  loading: boolean;
  err: boolean | string;
  problem:Problem [];
  message?: string;
  success?: boolean;
};

export interface ErrorPayload {
  message: string;
  status?: number;
  success?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  status: 'Solved' | 'Attempted' | 'Todo';
}


export type submissionReducerInitial = {
  loading: boolean;
  err: boolean | string;
  data:null | any;
  message?: string;
  success?: boolean;
};