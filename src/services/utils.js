import { storageGet } from "./storage";

export function getAuthHeaders(contentType) {
  return {
    headers: {
      Authorization: storageGet("access_token"),
      "content-type": contentType || "application/json",
    },
  };
}
