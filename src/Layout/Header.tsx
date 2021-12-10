import Head from "next/head";

export default function Header() {  
  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1, user-scalable=0"
      />
   
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      <meta
        name="application-name"
        content={"Donate with Plant-for-the-Planet"}
      />
      <meta
        name="apple-mobile-web-app-title"
        content={"Donate with Plant-for-the-Planet"}
      />
      <meta
        name="apple-mobile-web-app-title"
        content={"Donate with Plant-for-the-Planet"}
      />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="format-detection" content="telephone=no" />
      <link rel="icon" href={`/assets/favicons/favicon.ico`} />
      <link
        rel="shortcut icon"
        href={`/assets/favicons/favicon.ico`}
        type="image/x-icon"
      />
      <link
        rel="apple-touch-icon"
        href={`/assets/favicons/apple-touch-icon.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href={`/assets/favicons/apple-touch-icon-57x57.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href={`/assets/favicons/apple-touch-icon-72x72.pngg`}
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`/assets/favicons/apple-touch-icon-76x76.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href={`/assets/favicons/apple-touch-icon-114x114.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href={`/assets/favicons/apple-touch-icon-120x120.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href={`/assets/favicons/apple-touch-icon-144x144.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href={`/assets/favicons/apple-touch-icon-144x144.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/assets/favicons/apple-touch-icon-180x180.png`}
      />
    </Head>
  );
}
