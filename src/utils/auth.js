import Cookies from "js-cookie";

const TokenKey = "Authorization";
const tokenPrefix = "Bearer";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, tokenPrefix + " " + token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}