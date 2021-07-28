export default function BrowserNotSupported() {
  return (
    <div
      style={{
        margin: "20px",
        width: "100vw",
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
