import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);;
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};
