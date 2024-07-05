export interface UserData{
    _id?:string,
    name:string,
    password:string,
    email:string,
    otp:string
}

export type Signup={
    name?:string,
    email:string,
    password:string,
    otp?:string
}

export type Login={
    email:string,
    password:string
}