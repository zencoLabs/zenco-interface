import type { AddEthereumChainParameter } from '@web3-react/types'

export const ConnectChainID: number =1030   // // 71 //1030; 11155111
 
const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const CFX: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'CFX',
  symbol: 'CFX',
  decimals: 18,
}

export interface BasicChainInformation {
  urls: string[]
  name: string,
  blockExplorerUrls: string[] | undefined
}

export interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
  iconUrls: AddEthereumChainParameter["iconUrls"]
}

function isExtendedChainInformation(
  chainInformation: ExtendedChainInformation
): chainInformation is ExtendedChainInformation {

  return !!chainInformation.nativeCurrency
}


export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

 
export type ChainConfig = { [chainId: number]: ExtendedChainInformation }

export const MAINNET_CHAINS: ChainConfig = { 
  1030: {
    urls: ['https://evm.confluxrpc.com', 'https://conflux-espace.blockpi.network/v1/rpc/public'],
    name: 'Conflux eSpace',
    nativeCurrency: CFX,
    blockExplorerUrls: ['https://evm.confluxscan.net'],
    iconUrls: ['/icons/networks/conflux.png']
  },
}

export const TESTNET_CHAINS: ChainConfig = {
  11155111: {
    urls: [`https://sepolia.infura.io/v3/ada20c445dd547838f579b6306dadaa6`],
    name: 'Sepolia',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    iconUrls: ['/icons/networks/ethereum.svg']
  },
  71: {
    urls: ['https://evmtestnet.confluxrpc.com'],
    name: 'Conflux eSpace Testnet',
    nativeCurrency: CFX,
    blockExplorerUrls: ['https://evmtestnet.confluxscan.net'],
    iconUrls: ['/icons/networks/conflux.png']
  },
}

export const CHAINS: ChainConfig = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {}
)

export type ERC20TokenType = {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
  aToken?: boolean;
};

export interface BlogContractInfo {
  bodhi: string;
  spaceFactory: string;
  tradeHelper: string;
};


export const BlogContract: Record<number, BlogContractInfo> = { 
  [1030]: {
    bodhi: '0x81aa767e7977665ac124fa6306fb76fc7a628a8e',
    spaceFactory: '0x3f944ee92e3d8eb3bddb101a43197bf267b38c86',
    tradeHelper: '0xea99a2a055e0ae4d5d5d5a7c7f6819e1eb2bed23'
  },
  [71]: {
    bodhi: '0x375820ba9d9850009a690ac8145979c92a8fa0fb',
    spaceFactory: '0x7367ce05ee01f174e26790517c45aaa04c732607',
    tradeHelper: '0x1bc17ed20c1597192dee319844c6116db0075845'
  }, 
  [11155111]: {
    bodhi: '0x8920b2b8c488546b30106067894402992f9d09d7',
    spaceFactory: '0x9428272265d06f711b043fea3c1c41f10c7163e2',
    tradeHelper: '0x2277e686ab215ebc35fd04f17fa3233da472947b'
  },
}

export const APIURL = {
  api_url: 'https://zencoapi.hahone.com',
  api_text: 'https://zencoapi.hahone.com/upload-text',
  api_media: 'https://zencoapi.hahone.com/upload-media',
  ar_url: 'https://arweave.net/',
}

export interface GraphUriModal {
  bodhiURI: string;
  spaceFactoryURI: string;
};


export const GraphUriAPI = (): GraphUriModal => { 
  if (ConnectChainID == 1030) {
    return {
      bodhiURI: 'https://mainnet.congraph.io/subgraphs/name/bodhi/bodhi-subgraph',
      spaceFactoryURI: 'https://api.studio.thegraph.com/query/45313/space-subgraph/version/latest'
    }
  } 
  return {
    bodhiURI: 'https://api.studio.thegraph.com/query/45313/bodhi-subgraph-sepolia/version/latest', 
    spaceFactoryURI: 'https://api.studio.thegraph.com/query/45313/space-subgraph/20.2.0'
  }
}