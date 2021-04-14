import Head from "next/head";
import locales from "../../public/static/localeList.json";

export default function Header() {
  return (
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700;800;600&display=swap"
        rel="stylesheet"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1, user-scalable=0"
      />
      <meta property="og:locale" content={"en_US"} />
      {locales.map((locale) => {
        if (locale !== "en_US") {
          return (
            <meta
              key="og:locale:alternate"
              property="og:locale:alternate"
              content={locale}
            />
          );
        }
      })}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      <meta
        name="application-name"
        content={"Plant trees around the world - Plant-for-the-Planet"}
      />
      <meta
        name="apple-mobile-web-app-title"
        content={"Plant trees around the world - Plant-for-the-Planet"}
      />
      <meta
        name="apple-mobile-web-app-title"
        content={"Plant trees around the world - Plant-for-the-Planet"}
      />

      {/* <!-- New in iOS6  alt, --> */}
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
      {/* {themeType === 'theme-light' ? (
        <meta name="theme-color" content={styles.primaryColor} />
      ) : null} */}

      <title>{`Pay with Planet | Plant trees around the world - Plant-for-the-Planet`}</title>
      <meta property="og:site_name" content={'Plant trees around the world - Plant-for-the-Planet'} />
      {/* <meta
        property="og:url"
        content={`${process.env.SCHEME}://${config.tenantURL}`}
      /> */}
      <meta property="og:title" content={`Pay with Planet | ${'Plant trees around the world - Plant-for-the-Planet'}`} />
      <meta property="og:description" content={`We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.`} />
      <meta name="description" content={`We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.`} />
      <meta property="og:type" content="website" />
      {/* <meta property="og:image" content={config.meta.image} /> */}
      <link rel="alternate" href="android-app://org.pftp/projects" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={'Plant trees around the world - Plant-for-the-Planet'} />
      {/* <meta name="twitter:site" content={config.meta.twitterHandle} />
      <meta name="twitter:url" content={config.tenantURL} /> */}
      <meta name="twitter:description" content={`We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.`} />
    </Head>
  );
}
