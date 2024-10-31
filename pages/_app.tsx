import '/public/fonts/inter/inter.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app'
import { ReactNode } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '@/src/createEmotionCache';
import { NextPage } from 'next';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppGlobalStyles } from '@/src/layouts/AppGlobalStyles';
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { connections } from '@/src/connection'
import { Connector } from '@web3-react/types'
import { Web3ContextProvider } from '@/src/hooks/Web3Provider';
import { WalletModal } from '@/src/components/WalletConnection/WalletModal';
import { SwitchNetworkModal } from '@/src/components/WalletConnection/SwitchNetworkModal';
import { BackgroundDataProvider } from '@/src/hooks/BackgroundDataProvider'; 
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import dynamic from 'next/dynamic'; 
import 'quill/dist/quill.snow.css'; 
import "react-toastify/dist/ReactToastify.css";
import 'react-image-crop/dist/ReactCrop.css'; 
import { bodhi_ApolloClient } from '@/src/apollo/client';
import { ToastContainer } from "react-toastify";

const BlogEditorModal = dynamic(() =>
  import('@/src/components/Users/BlogEditorModal').then(
    (module) => module.BlogEditorModal
  )
);
const UserinfoModal = dynamic(() =>
  import('@/src/components/Users/UserinfoModal').then(
    (module) => module.UserinfoModal
  )
);
const AssetBuyModal = dynamic(() =>
  import('@/src/components/transactions/AssetBuyModal').then(
    (module) => module.AssetBuyModal
  )
);
const SpaceTransactionModal = dynamic(() =>
  import('@/src/components/transactions/SpaceTransactionModal').then(
    (module) => module.SpaceTransactionModal
  )
);
const SpaceDistributionModal = dynamic(() =>
  import('@/src/components/modules/spaces/SpaceDistributionModal').then(
    (module) => module.SpaceDistributionModal
  )
);
const SpaceDetailModal = dynamic(() =>
  import('@/src/components/modules/spaces/SpaceDetailModal').then(
    (module) => module.SpaceDetailModal
  )
);

declare global {
  interface Window {
    // ethereum: any;
    metamask: any;
    fluent: any;
    okxwallet: any;
    conflux: any;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
 

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}


export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  const connectors = connections.map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks])

  return (
    // <CacheProvider value={emotionCache}>
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Zenco</title>
        <meta name="description" content="Zenco is a decentralized information publishing platform based on the Conflux ecosystem. We promote valuable content and incentivize creators and contributors." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={bodhi_ApolloClient}>
          <Web3ReactProvider connectors={connectors}>
            <Web3ContextProvider>
              <AppGlobalStyles>
                <BackgroundDataProvider>
                  {getLayout(<Component {...pageProps} />)}
                  <WalletModal />
                  <SwitchNetworkModal />
                  <UserinfoModal />
                  <BlogEditorModal />
                  <AssetBuyModal />
                  <SpaceTransactionModal />
                  <SpaceDistributionModal/>
                  <SpaceDetailModal/>
                  <ToastContainer />
                </BackgroundDataProvider>
              </AppGlobalStyles>
            </Web3ContextProvider>
          </Web3ReactProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </>
    // </CacheProvider>
  )
}
