import http from "./httpService";
import { APIUrl } from "./link";

export function deleteUser(id) {
  return http.delete(`${APIUrl}/api/v1/users/${id}`);
}
