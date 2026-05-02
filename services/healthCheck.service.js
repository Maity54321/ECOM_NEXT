import http from "./httpService";
import { APIUrl } from "./link";

export function ping() {
    return http.get(`${APIUrl}`);
}
