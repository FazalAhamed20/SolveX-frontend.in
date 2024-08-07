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
  problem: Problem[];
  message?: string;
  success?: boolean;
};
export type practicalReducerInitial = {
  loading: boolean;
  err: boolean | string;
  practical: Practical[];
  message?: string;
  success?: boolean;
};

export type clanReducerInitial = {
  loading: boolean;
  err: boolean | string;
  clan: Clan[];
  message?: string;
  success?: boolean;
};
export type paymentReducerInitial = {
  loading: boolean;
  err: boolean | string;
  payment: [];
  message?: string;
  success?: boolean;
};

export interface Clan {
  clanId?: string;
  id?: number;
  name?: string;
  description?: string;
  members?: ClanMember[];
  trophies?: number;
  userId?: string;
}

export interface ClanMember {
  id?: any;
  name: string;
  role: string;
  avatar?: string;
}

export interface ErrorPayload {
  message: string;
  status?: number;
  success?: boolean;
  data?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  status: 'Solved' | 'Attempted' | 'Todo';
}

export interface Practical {
  id: string;
  title: string;
  subtitle?: string;
  videoUrl: string;
  quickTips: string[];
  language: string;
}

export type submissionReducerInitial = {
  loading: boolean;
  err: boolean | string;
  data: null | any;
  message?: string;
  success?: boolean;
};
