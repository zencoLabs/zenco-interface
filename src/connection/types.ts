import { Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
 

export enum ConnectionType { 
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT_V2 = 'WALLET_CONNECT_V2',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
  DEPRECATED_NETWORK = 'DEPRECATED_NETWORK',
  EIP_6963_INJECTED = 'EIP_6963_INJECTED',
}

export interface ProviderInfo {
  name: string
  icon?: string
  rdns?: string
}

export interface Connection {
  connector: Connector
  hooks: Web3ReactHooks
  type: ConnectionType
  shouldDisplay(): boolean
  /** Executes specific pre-activation steps necessary for some connection types. Returns true if the connection should not be activated. */
  overrideActivate?: (chainId?: number) => boolean
  /** Optionally include isDarkMode when displaying icons that should change with current theme */
  getProviderInfo(isDarkMode?: boolean): ProviderInfo
}

 