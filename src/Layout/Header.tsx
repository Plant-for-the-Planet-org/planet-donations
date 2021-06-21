import Head from "next/head";
import locales from "../../public/static/localeList.json";

export default function Header() {
  return (
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap"
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



      <title>{`Donate with Plant-for-the-Planet`}</title>
      <meta name="title" content="Donate with Plant-for-the-Planet" />
      <meta name="description" content="Make tax deductible donations to over 160+ restoration and conservation projects. Your journey to a trillion trees starts here." />

      <meta property="og:site_name" content={'Donate with Plant-for-the-Planet'} />


      <meta property="og:title" content={`Donate with Plant-for-the-Planet`} />
      <meta property="og:description" content={`Make tax deductible donations to over 160+ restoration and conservation projects. Your journey to a trillion trees starts here.`} />
      <meta name="description" content={`Make tax deductible donations to over 160+ restoration and conservation projects. Your journey to a trillion trees starts here.`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="" />
      <meta property="og:url" content="https://donate.plant-for-the-planet.org/" />


      <link rel="alternate" href="android-app://org.pftp/projects" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={'Donate with Plant-for-the-Planet'} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content=""></meta>
      <meta property="twitter:url" content="https://donate.plant-for-the-planet.org/" />
      <meta property="twitter:title" content="Donate with Plant-for-the-Planet" /> 

      <meta name="twitter:description" content={`Make tax deductible donations to over 160+ restoration and conservation projects. Your journey to a trillion trees starts here.`} />
    </Head>
  );
}
