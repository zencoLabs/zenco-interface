import { CHAINS, ExtendedChainInformation } from "./chains";
 
export enum WalletType {
  INJECTED = "injected", 
  OKX = "okx",
  FLUENT = "fluent",
  BROWSER = "browser ",
}

export function GetWalletType(value: string): WalletType {
  switch(value){
    case "injected":return WalletType.INJECTED; 
    case "OKX":return WalletType.OKX;
    case "fluent":return WalletType.FLUENT;
    
  }
  return WalletType.INJECTED
}

export type NetworkConfig = {
  name: string;
  privateJsonRPCUrl?: string; // private rpc will be used for rpc queries inside the client. normally has private api key and better rate
  privateJsonRPCWSUrl?: string;
  publicJsonRPCUrl: readonly string[]; // public rpc used if not private found, and used to add specific network to wallets if user don't have them. Normally with slow rates
  publicJsonRPCWSUrl?: string; 
  // https://github.com/aave/aave-api
  ratesHistoryApiUrl?: string; 
  baseUniswapAdapter?: string;
  /**
   * When this is set withdrawals will automatically be unwrapped
   */
  wrappedBaseAssetSymbol?: string;
  baseAssetSymbol: string;
  // needed for configuring the chain on metemask when it doesn't exist yet
  baseAssetDecimals: number;
  // usdMarket?: boolean;
  // function returning a link to etherscan et al
  explorerLink: string;
  explorerLinkBuilder: (props: ExplorerLinkBuilderProps) => string;
  // set this to show faucets and similar
  isTestnet?: boolean;
  // get's automatically populated on fork networks
  isFork?: boolean;
  networkLogoPath: string;
  // contains the forked off chainId
  underlyingChainId?: number;
  bridge?: {
    icon: string;
    name: string;
    url: string;
  };
};

export type ExplorerLinkBuilderProps = {
  tx?: string;
  address?: string;
};

export function getNetworkConfig(chainId: number): NetworkConfig {
  const config = CHAINS[chainId];
  const currency = (config as ExtendedChainInformation).nativeCurrency;
  return {
    name: config.name,
    publicJsonRPCUrl: config.urls,
    baseAssetSymbol: currency.symbol,
    baseAssetDecimals: currency.decimals,
    explorerLink: config.blockExplorerUrls![0],
    explorerLinkBuilder: ({ tx, address }: ExplorerLinkBuilderProps) => {
      return tx
        ? config.blockExplorerUrls![0] + "/tx/" + tx
        : config.blockExplorerUrls![0] + "/address/" + address;
    },
    networkLogoPath: (config as ExtendedChainInformation).iconUrls![0],
  };
}
