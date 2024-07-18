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
  problem: [];
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
