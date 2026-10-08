// Sentry v11 collects cookies, user info and request bodies by default. This keeps the stricter v10 defaults, since this app handles payments.
const SENSITIVE_KEYS = ["forwarded", "-ip", "remote-", "via", "-user"];

export const dataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: {
    request: { deny: SENSITIVE_KEYS },
    response: { deny: SENSITIVE_KEYS },
  },
  httpBodies: [],
  urlQueryParams: { deny: SENSITIVE_KEYS },
  genAI: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  graphQL: { document: false, variables: false },
};
