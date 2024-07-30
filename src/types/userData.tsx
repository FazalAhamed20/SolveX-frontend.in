export interface UserData {
  _id?: string;
  username: string;
  password?: string;
  email: string;
  otp?: string;
  bio?: string;
  role?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  profileImage?: string;
  isBlocked?: boolean;
}

export type Signup = {
  name?: string;
  email: string;
  password: string;
  otp?: string;
};

export type Signin = {
  email: string;
  password: string;
};

export type Profile = {
  email: any;
  username: string;
  bio?: string;
  role?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  profileImage?: string;
};


export type Problem={
  _id: string;
  id:string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    code:string,
    javascript:true,
    isBlocked?:boolean,
    status: 'Solved' | 'Attempted' | 'Todo';

}


export type Practice={
  _id: string;
  id:string;
    title: string;
    description: string;
    subTitle:string;
    videoUrl:string;
    quickTips:string[];
    language:string
    isBlocked?:boolean,
    

}


export type Submission={
  email?:String,
  code?:String,
  id?:String;
  title?:string;
  difficuly?:String;
  language?:String;
  submited?:String

}

