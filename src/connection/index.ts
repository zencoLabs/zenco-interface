import { initializeConnector } from '@web3-react/core' 
import { Actions, Connector } from '@web3-react/types'
import { EIP6963 } from './eip6963'
import { Connection, ConnectionType, ProviderInfo } from './types'
import { MetaMask } from '@web3-react/metamask'
import { getDeprecatedInjection, getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet } from './utils'
import { isMobile } from 'react-device-detect'

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

type InjectedConnection = Connection & {
  /** Returns a copy of the connection with metadata & activation for a specific extension/provider */
  wrap: (providerInfo: ProviderInfo) => Connection | undefined
  /** Sets which extension/provider the connector should activate */
  selectRdns(rdns: string): void
}

//metamask xdefi okx...
const [eip6963, eip6963hooks] = initializeConnector<EIP6963>((actions) => new EIP6963({ actions, onError }))
// Since eip6963 wallet are `announced` dynamically after compile-time, but web3provider required connectors to be statically defined,
// we define a static eip6963Connection object that provides access to all eip6963 wallets. The `wrap` function is used to obtain a copy
// of the connection with metadata & activation for a specific extension/provider.
export const eip6963Connection: InjectedConnection = {
  getProviderInfo: () => eip6963.provider.currentProviderDetail?.info ?? { name: `Browser Wallet` },
  selectRdns: (rdns: string) => eip6963.selectProvider(rdns),
  connector: eip6963,
  hooks: eip6963hooks,
  type: ConnectionType.EIP_6963_INJECTED,
  shouldDisplay: () => false, // Since we display each individual eip6963 wallet, we shouldn't display this generic parent connection
  wrap(providerInfo: ProviderInfo) {
    const { rdns } = providerInfo
    if (!rdns) return undefined
    return {
      ...this,
      getProviderInfo: () => providerInfo,
      overrideActivate() {
        eip6963.selectProvider(rdns) // Select the specific eip6963 provider before activating
        return false
      },
      shouldDisplay: () => true, // Individual eip6963 wallets should always be displayed
    }
  },
}
 
const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() && !isMobile && (!getIsInjected() || getIsCoinbaseWallet())
const getIsGenericInjector = () => getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet()

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }))

export const deprecatedInjectedConnection: Connection = {
  getProviderInfo: (isDarkMode: boolean) => getDeprecatedInjection(isDarkMode) ?? { name: `Browser Wallet` },
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  shouldDisplay: () => getIsMetaMaskWallet() || getShouldAdvertiseMetaMask() || getIsGenericInjector(),
  // If on non-injected, non-mobile browser, prompt user to install Metamask
  overrideActivate: () => {
    if (getShouldAdvertiseMetaMask()) {
      window.open('https://metamask.io/', 'inst_metamask')
      return true
    }
    return false
  },
} 

export const connections = [ 
  deprecatedInjectedConnection,
  // walletConnectV2Connection,
  // coinbaseWalletConnection,
  eip6963Connection, 
]

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = connections.find((connection) => connection.connector === c)
    if (!connection) {
      throw Error('unsupported connector')
    }
    return connection
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return deprecatedInjectedConnection
      // case ConnectionType.COINBASE_WALLET:
      //   return coinbaseWalletConnection
      // case ConnectionType.WALLET_CONNECT_V2:
      //   return walletConnectV2Connection 
      case ConnectionType.EIP_6963_INJECTED:
        return eip6963Connection
    }
  }
}
