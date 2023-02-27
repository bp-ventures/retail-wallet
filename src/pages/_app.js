import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import SSRProvider from "react-bootstrap/SSRProvider";
import { ConnectWalletModal } from "../components/modals/";
import { SiteConfigs } from "../consts";
import {
  GlobalStateProvider,
  LanguageProvider,
  ToasterProvider,
  AuthProvider,
} from "../contexts/";
import Layout from "../layout";
import "../styles/global.scss";
import "../styles/dark-theme.scss";
import { useRouter } from "next/router";
import { fetchTranslations } from "../utils";
import * as ga from "../lib/helpers/ga";

const { siteName } = SiteConfigs;
function MyApp({ Component, pageProps }) {
  const {
    title = `${siteName} - Dashboard`,
    description = `${siteName} - Dashboard`,
    hideAnnouncement,
  } = pageProps;
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <SSRProvider>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <LanguageProvider fetchTranslations={fetchTranslations}>
        <AuthProvider>
          <GlobalStateProvider>
            <ToasterProvider>
              <Layout
                setIsConnectModalVisible={setIsConnectModalVisible}
                hideAnnouncement={hideAnnouncement}
              >
                <Component
                  {...pageProps}
                  setIsConnectModalVisible={setIsConnectModalVisible}
                />
                <ConnectWalletModal
                  isConnectModalVisible={isConnectModalVisible}
                  toggleModal={() =>
                    setIsConnectModalVisible(!isConnectModalVisible)
                  }
                />
              </Layout>
            </ToasterProvider>
          </GlobalStateProvider>
        </AuthProvider>
      </LanguageProvider>
    </SSRProvider>
  );
}

export default MyApp;
