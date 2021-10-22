import {
  parseCookies,
  setCookie as NookiesSetCookie,
  destroyCookie,
} from 'nookies';

const options = {};

export function setCookie(key: string, value: any) {
  NookiesSetCookie(null, key, value, options);
}

export function getCookie(key: string) {
  const cookies = parseCookies();
  return cookies[key];
}

export function removeCookie(key: string) {
  destroyCookie(null, key);
}
