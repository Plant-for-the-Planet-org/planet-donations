import { ServerStyleSheets } from "@material-ui/core/styles";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { useRouter } from "next/router";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    console.log({ ...initialProps }, "CTX");
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body
          style={{
            overscrollBehavior: "contain",
            backgroundColor: "transparent",
            opacity: 1,
          }}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props: any) =>
        sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);
  // console.log(initialProps, "IProps");
  // console.log(ctx, "Context");
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};

export default MyDocument;
