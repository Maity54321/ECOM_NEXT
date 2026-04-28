import http from "./httpService";
import { APIUrl } from "./link";

export function checkout(amount) {
  return http.post(`${APIUrl}/api/v1/payment/checkout`, { amount });
}

export function apiKey() {
  return http.get(`${APIUrl}/api/v1/payment/getKey`);
}
