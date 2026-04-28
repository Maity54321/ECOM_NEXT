import http from "./httpService";
import { APIUrl } from "./link";

export function createCart(cart) {
  http.post(
    `${APIUrl}/api/v1/cart`,
    { cartItems: cart },
    {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    }
  );
}

export function getCartItems() {
  return http.get(`${APIUrl}/api/v1/cart`, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function deleteItem(id) {
  return http.delete(`${APIUrl}/api/v1/cart/${id}`, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}
