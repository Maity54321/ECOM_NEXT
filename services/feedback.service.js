import http from "./httpService";
import { APIUrl } from "./link";

export function submitFeedback(fromName, fromEmail, subject, body) {
    return http.post(
        `${APIUrl}/api/v1/feedback`,
        { fromName, fromEmail, subject, mailBody: body },
        {
            headers: {
                authorization: typeof window !== "undefined" ? localStorage.getItem("token") : "",
            },
        }
    );
}