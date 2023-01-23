import { ReactElement } from "react";

export default function MisconfiguredEnvironment(): ReactElement {
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
      <p>Server config error. Please try after some time.</p>
    </div>
  );
}
