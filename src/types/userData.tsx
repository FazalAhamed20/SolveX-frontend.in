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
