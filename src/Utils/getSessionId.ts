import { v7 as uuidV7 } from "uuid";

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
      sessionId = uuidV7();
    }
    if (!sessionId) {
      sessionId = uuidV7();
      localStorage.setItem("sessionId", sessionId);
    }
  } else {
    sessionId = uuidV7();
    if (typeof window !== "undefined") {
      localStorage.setItem("sessionId", sessionId);
    }
  }
  return sessionId;
}
