import http from "./httpService";
import { APIUrl } from "./link";

export function registerUser(datas) {
  return http.post(`${APIUrl}/api/v1/users/`, datas, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
}

export function loginUser(datas) {
  return http.post(`${APIUrl}/api/v1/auth/`, datas);
}
