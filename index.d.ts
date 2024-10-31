
declare module '@metamask/jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement
} 
declare module 'toformat'

interface Window {
  GIT_COMMIT_HASH?: string
  // TODO: Remove all references to window.ethereum once old injection process is fully deprecated
  ethereum?: {
    autoRefreshOnNetworkChange?: boolean

    // Flags set by injected wallet extensions/browsers:
    isMetaMask?: true // set by MetaMask (and by some non-MetaMask wallets that inject as MetaMask)
    isCoinbaseWallet?: true
    isBraveWallet?: true
    isRabby?: true
    isTrust?: true
    isLedgerConnect?: true
  },
  xfi: any,
  okxwallet: any,
  unisat: any,
}