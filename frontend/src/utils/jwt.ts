import jwt_decode from "jwt-decode";

export const validateToken = (token: string): boolean => {
    const now: number = Math.round(new Date().getTime() / 1000);
    const decodedToken: any = jwt_decode(token);
    const isValid: boolean = decodedToken && now < decodedToken.exp;

    return isValid;
};
