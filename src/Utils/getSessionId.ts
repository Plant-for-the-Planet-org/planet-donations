import { v1 } from "uuid";

/**
 * Async function to return a sessionId string
 * @returns {Promise<string>} sessionId
 */
export default async function getsessionId(): Promise<string> {
  let sessionId;
  if (typeof Storage !== "undefined") {
    if (typeof window !== "undefined") {
      sessionId = localStorage.getItem("sessionId");
    } else {
      sessionId = v1();
    }
    if (!sessionId) {
      sessionId = v1();
      localStorage.setItem("sessionId", sessionId);
    }
  } else {
    sessionId = v1();
    if (typeof window !== "undefined") {
      localStorage.setItem("sessionId", sessionId);
    }
  }
  return sessionId;
}
