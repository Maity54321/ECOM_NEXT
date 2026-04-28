import http from "./httpService";
import { APIUrl } from "./link";

export function getProducts(keyword = "", price = [0, 99999], category) {
  let myAPIUrl = "";
  if (keyword && price) {
    myAPIUrl = `${APIUrl}/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}`;
  } else if (category) {
    myAPIUrl = `${APIUrl}/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}`;
  } else {
    myAPIUrl = `${APIUrl}/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}`;
  }
  return http.get(myAPIUrl);
}

export function getImages() {
  return http.get(`${APIUrl}/api/v1/upd`);
}

export function createProduct(productData) {
  return http.post(`${APIUrl}/api/v1/products`, productData, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function uploadImages(imageData) {
  return http.post(`${APIUrl}/api/v1/upd`, imageData, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function getParticularProduct(id) {
  return http.get(`${APIUrl}/api/v1/products/` + id);
}

export function deleteProduct(id) {
  return http.delete(`${APIUrl}/api/v1/products/` + id, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}

export function updateProduct(product) {
  const id = product.id;
  const body = { ...product };
  delete body.id;
  return http.put(`${APIUrl}/api/v1/products/` + id, body, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  });
}
