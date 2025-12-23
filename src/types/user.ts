export interface LoginRes {
    message: string;
    token: string
}

export interface LoginReq {
    username: string;
    password: string;
    rememberMe: boolean
}

export interface RegisterReq {
    username: string;
    password: string;
    email: string;
}
export interface RegisterRes {
    message: string;
    userId: number;
}

export interface DecodedToken {
    id: number;
    username: string;
    exp: number;
}