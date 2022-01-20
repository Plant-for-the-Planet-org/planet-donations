import jwt_decode, { JwtPayload } from "jwt-decode";

export const decodeToken = (token: string): JwtPayload => {
  return jwt_decode(token);
};

export const validateToken = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
