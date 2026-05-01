import http from "./httpService";
import { APIUrl } from "./link";

export function myOrder(order) {
  return http.post(`${APIUrl}/api/v1/orders/new`, order, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function myAllOrders() {
  return http.get(`${APIUrl}/api/v1/orders`, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function getUserOrderDetails(id) {
  return http.get(`${APIUrl}/api/v1/orders/singleOrder/${id}`, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function allOrders() {
  return http.get(`${APIUrl}/api/v1/orders/allOrders`, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function updateOrderStatus(id, status) {
  return http.put(`${APIUrl}/api/v1/orders/${id}`, { status }, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function adminDeleteOrder(id) {
  return http.delete(`${APIUrl}/api/v1/orders/${id}`, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}
