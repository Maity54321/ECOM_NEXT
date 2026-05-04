import http from "./httpService";
import { APIUrl } from "./link";

export function deleteUser(id) {
    return http.delete(`${APIUrl}/api/v1/users/${id}`);
}

export function getAllUsers() {
    return http.get(`${APIUrl}/api/v1/users`);
}

export function updateUserRole(id, role) {
    return http.patch(`${APIUrl}/api/v1/users/updaterole/${id}`, { role }, {
        headers: {
            authorization: localStorage.getItem("token"),
        },
    });
}

