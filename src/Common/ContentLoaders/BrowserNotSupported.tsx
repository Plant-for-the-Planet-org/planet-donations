import { ReactElement } from "react";

export default function BrowserNotSupported(): ReactElement {
  return (
    <div
      style={{
        margin: "20px",
        width: "90vw",
        height: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>
        Your browser is not supported. Please use a newer version or another
        browser.
      </p>
    </div>
  );
}
