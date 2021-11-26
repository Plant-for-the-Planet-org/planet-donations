import { v1 } from "uuid";

export default async function getsessionId() {
  let sessionId;
  if (typeof Storage !== "undefined") {
    if (typeof window !== "undefined" && localStorage) {
      sessionId = localStorage.getItem("sessionId");
    } else {
      sessionId = v1();
    }
    if (!sessionId) {
      sessionId = v1();
      if (localStorage) {
        localStorage.setItem("sessionId", sessionId);
      }
    }
  } else {
    sessionId = v1();
    if (typeof window !== "undefined" && localStorage) {
      localStorage.setItem("sessionId", sessionId);
    }
  }
  return sessionId;
}
