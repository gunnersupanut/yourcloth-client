export interface LoginRes {
    message: string;
    token: string
}

export interface LoginReq {
    username: string;
    password: string;
    rememberMe: boolean
}

export interface DecodedToken {
    id: number;
    username: string;
    exp: number;
}