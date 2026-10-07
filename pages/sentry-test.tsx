// TEMPORARY: manual test page for client-side Sentry errors. Remove before merging.
import React, { ReactElement, useState } from "react";
import Head from "next/head";
import { GetStaticProps } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  captureException,
  captureMessage,
  ErrorBoundary,
} from "@sentry/nextjs";
import nextI18NextConfig from "../next-i18next.config.js";

function BrokenComponent(): ReactElement {
  throw new Error("Sentry test: error thrown while rendering a component");
}

type Test = {
  label: string;
  description: string;
  run: () => void;
};

function SentryTest(): ReactElement {
  const [status, setStatus] = useState("");
  const [showBroken, setShowBroken] = useState(false);

  const tests: Test[] = [
    {
      label: "Uncaught error in click handler",
      description: "Throws an Error that nothing catches.",
      run: () => {
        throw new Error("Sentry test: uncaught error in click handler");
      },
    },
    {
      label: "Unhandled promise rejection",
      description: "Rejects a promise that has no catch.",
      run: () => {
        Promise.reject(new Error("Sentry test: unhandled promise rejection"));
      },
    },
    {
      label: "Error inside setTimeout",
      description: "Throws after a 100 ms delay, outside the click handler.",
      run: () => {
        setTimeout(() => {
          throw new Error("Sentry test: error inside setTimeout");
        }, 100);
      },
    },
    {
      label: "TypeError (call undefined function)",
      description: "Calls a function that does not exist, like a real bug.",
      run: () => {
        const data = {} as { format?: () => void };
        (data.format as () => void)();
      },
    },
    {
      label: "Render error (inside ErrorBoundary)",
      description:
        "Renders a component that throws. Sentry.ErrorBoundary reports it and shows a fallback.",
      run: () => setShowBroken(true),
    },
    {
      label: "Handled error (captureException)",
      description: "Catches an error and sends it to Sentry by hand.",
      run: () => {
        try {
          throw new Error(
            "Sentry test: handled error sent with captureException",
          );
        } catch (error) {
          captureException(error);
        }
      },
    },
    {
      label: "Message (captureMessage)",
      description: "Sends a plain warning message, not an error.",
      run: () => {
        captureMessage(
          "Sentry test: message sent with captureMessage",
          "warning",
        );
      },
    },
  ];

  const runTest = (test: Test) => {
    setStatus(`Triggered: ${test.label} (${new Date().toLocaleTimeString()})`);
    test.run();
  };

  return (
    // The theme sets text color, so the background must follow it too or dark mode shows white on white
    <div style={{ flexGrow: 1, backgroundColor: "var(--background-color)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 16px" }}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <h1>Sentry client error tests</h1>
        <p>
          Each button sends one kind of error to Sentry. Sentry only runs when NODE_ENV is production, so use a build (next build and next start) or a preview deploy.
        </p>
        <p>Every event message starts with &quot;Sentry test:&quot; so it is easy to find in Sentry.</p>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {tests.map((test) => (
            <li key={test.label} style={{ marginBottom: 16 }}>
              <button type="button" onClick={() => runTest(test)}>
                {test.label}
              </button>
              <div style={{ fontSize: 14, opacity: 0.7 }}>
                {test.description}
              </div>
            </li>
          ))}
        </ul>

        {status && <p role="status">{status}</p>}

        {showBroken && (
          <ErrorBoundary
            fallback={
              <p>Render error caught by ErrorBoundary and sent to Sentry.</p>
            }
          >
            <BrokenComponent />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

export default SentryTest;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(
      locale || "en",
      ["common", "country", "donate"],
      nextI18NextConfig,
    )),
  },
});
