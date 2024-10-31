import { StateCreator } from "zustand";
import { getNetworkConfig } from "../libs/networksConfig";
import { 
    ConnectChainID,
    ERC20TokenType,
} from "../libs/chains"; 
import { Connector } from "@web3-react/types";
import { Connection } from "../connection/types";
import { didUserReject } from "../connection/utils";
import detectProvider from "@fluent-wallet/detect-provider";
import { ethers } from "ethers";
import { RootStore } from "./root";

type FluentModals = {
    account?: string;
    chainId?: number;
    provider?: any;
}

export interface Web3Slice {
    isWalletModalOpen: boolean;
    setWalletModalOpen: (open: boolean) => void; 
    account?: string | undefined; 
    signer?: ethers.providers.JsonRpcSigner | undefined;
    setConnectInfo: (account?: string, signer?: ethers.providers.JsonRpcSigner) => void;
    connectWallet: (connection: Connection, onSuccess?: () => void, newChainId?: number) => Promise<void>;
    disconnectWallet: (connector: Connector) => Promise<void>;
    addERC20Token: (token: ERC20TokenType) => Promise<void>;
    switchNetwork: (connector: Connector, chainId: number) => Promise<void>; 
    fluentConnectWallet: () => Promise<void>;
    fluentWeb3Context?: FluentModals;
    browserConnectWallet: () => Promise<void>;
    browserWeb3Context?: FluentModals;
    ethPrice?: number;
}

export const createWeb3Slice: StateCreator<
    RootStore,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
    [],
    Web3Slice
> = (set, get) => {

    return {
        isWalletModalOpen: false,
        setWalletModalOpen(open: boolean) {
            set({ isWalletModalOpen: open });
        },
        setConnectInfo(account, signer) {
            set({
                account:account?.toLowerCase(),
                signer
            });
        },
        async connectWallet(connection, onSuccess, newChainId) {
            try {

                const oAct = connection.overrideActivate?.(newChainId ?? ConnectChainID)
                if (oAct) {
                    return
                }
                await connection.connector.activate()
                if (onSuccess) onSuccess()

                const { rdns, name } = connection.getProviderInfo()
                localStorage.setItem('app_connected', '1');
                localStorage.setItem('app_connect_wallet', name);
                localStorage.setItem('app_connect_rnds', rdns ?? '');
                localStorage.setItem('app_connect_type', connection.type);

                set({
                    isWalletModalOpen: false,
                });

            } catch (error) {
                // Gracefully handles errors from the user rejecting a connection attempt
                if (didUserReject(connection, error)) {
                    return
                }
                // TODO(WEB-1859): re-add special treatment for already-pending injected errors & move debug to after didUserReject() check 
                console.error(error)
            }
        },
        async disconnectWallet(connector) { 

            const app_connect_wallet = localStorage.getItem('app_connect_wallet');
            if (app_connect_wallet == 'fluent') {
                localStorage.removeItem('app_connected');
                localStorage.removeItem('app_connect_wallet');
                set({
                    fluentWeb3Context: undefined
                });
            }
            else if (app_connect_wallet == 'browser') {
                localStorage.removeItem('app_connected');
                localStorage.removeItem('app_connect_wallet');
                set({
                    browserWeb3Context: undefined
                });
            }
            else {
                if (connector) {
                    connector.deactivate?.()
                    connector.resetState()
                    localStorage.removeItem('app_connected');
                    localStorage.removeItem('app_connect_wallet');
                    localStorage.removeItem('app_connect_type');
                }
            }

            set({
                account: undefined,
                signer: undefined
            });

        },
        async addERC20Token({ address, symbol, decimals, image }: ERC20TokenType) {
            const injectedProvider = (window as any).ethereum;
            if (window && injectedProvider) {
                if (
                    address.toLowerCase() !==
                    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
                ) {
                    await injectedProvider.request({
                        method: "wallet_watchAsset",
                        params: {
                            type: "ERC20",
                            options: {
                                address,
                                symbol,
                                decimals,
                                image,
                            },
                        },
                    });
                }
            }
        },
        async switchNetwork(connector, chainId) {
            const app_connect_wallet = localStorage.getItem('app_connect_wallet');
            if (app_connect_wallet == 'fluent') {
                const info = getNetworkConfig(chainId);

                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${chainId.toString(16)}`, // Hexadecimal representation of the chainId
                                chainName: info.name,
                                nativeCurrency: {
                                    symbol: info.baseAssetSymbol,
                                    decimals: info.baseAssetDecimals,
                                },
                                rpcUrls: info.publicJsonRPCUrl[0],
                                blockExplorerUrls: [info.explorerLink],
                            }
                        ],
                    });

                    const provider = await detectProvider({
                        injectFlag: "conflux",
                        defaultWalletFlag: "isFluent",
                    })

                    const accounts = await (provider as any).request({ method: 'eth_requestAccounts' })
                        .catch((err: { code: number; }) => {
                            if (err.code === 4001) {
                                console.log('Please connect to Fluent Wallet.');
                            } else {
                                console.error(err);
                            }
                        });


                    set({
                        fluentWeb3Context: {
                            account: accounts[0],
                            chainId,
                            provider
                        }
                    });


                } catch (error) {
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: `0x${chainId.toString(16)}`, // Hexadecimal representation of the chainId
                                chainName: info.name,
                                nativeCurrency: {
                                    symbol: info.baseAssetSymbol,
                                    decimals: info.baseAssetDecimals,
                                },
                                rpcUrls: info.publicJsonRPCUrl[0],
                                blockExplorerUrls: [info.explorerLink],
                            }
                        ]
                    });
                }
            }
            else if (app_connect_wallet == 'browser') {
                const info = getNetworkConfig(chainId);

                window.ethereum
                    .request({
                        method: 'wallet_switchEthereumChain', params: [
                            {
                                chainId: `0x${chainId.toString(16)}`, // Hexadecimal representation of the chainId
                                chainName: info.name,
                                nativeCurrency: {
                                    symbol: info.baseAssetSymbol,
                                    decimals: info.baseAssetDecimals,
                                },
                                rpcUrls: info.publicJsonRPCUrl[0],
                                blockExplorerUrls: [info.explorerLink],
                            }
                        ]
                    })
                    .then(() => {
                        set({
                            browserWeb3Context: {
                                account: get().browserWeb3Context?.account,
                                chainId,
                                provider: window.ethereum
                            }
                        });
                    })
                    .catch(() => {
                        window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: `0x${chainId.toString(16)}`, // Hexadecimal representation of the chainId
                                    chainName: info.name,
                                    nativeCurrency: {
                                        symbol: info.baseAssetSymbol,
                                        decimals: info.baseAssetDecimals,
                                    },
                                    rpcUrls: info.publicJsonRPCUrl[0],
                                    blockExplorerUrls: [info.explorerLink],
                                }
                            ]
                        });
                    });
            }
            else {
                try { 
                    const info = getNetworkConfig(chainId);
                    const addChainParameter = {
                        chainId,
                        chainName: info.name,
                        rpcUrls: info.publicJsonRPCUrl,
                        nativeCurrency: {
                            symbol: info.baseAssetSymbol,
                            decimals: info.baseAssetDecimals,
                        },
                        blockExplorerUrls: [info.explorerLink],
                    }
                    await connector.activate(addChainParameter) 

                } catch (error) {
                    // In activating a new chain, the connector passes through a deactivated state.
                    // If we fail to switch chains, it may remain in this state, and no longer be usable.
                    // We defensively re-activate the connector to ensure the user does not notice any change.
                    try {
                        await connector.activate()
                    } catch (error) {
                        console.error('Failed to re-activate connector', error)
                    }
                    throw error
                } finally { 
                }
            }


        },
        async fluentConnectWallet() {

            const provider = await detectProvider({
                injectFlag: "conflux",
                defaultWalletFlag: "isFluent",
            })
            if (provider) {
                const chainId = await (provider as any).request({ method: 'eth_chainId' });
                await (provider as any).request({ method: 'eth_requestAccounts' })
                    .then((accounts: any) => {
                        set({
                            fluentWeb3Context: {
                                account: accounts[0].toLowerCase(),
                                chainId: parseInt(chainId, 16),
                                provider
                            },
                            isWalletModalOpen: false,
                        });

                        localStorage.setItem('app_connected', '1');
                        localStorage.setItem('app_connect_wallet', 'fluent');
                    })
                    .catch((err: { code: number; }) => {
                        if (err.code === 4001) {
                            console.log('Please connect to Fluent Wallet.');
                        } else {
                            console.error(err);
                        }
                    }); 
 
                window.ethereum.on('accountsChanged', (_accounts: any) => {
                    set({
                        fluentWeb3Context: {
                            account: _accounts[0].toLowerCase(),
                            chainId: parseInt(chainId, 16),
                            provider
                        }
                    });
                }); 
            } 

        },
        async browserConnectWallet() {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

            const _chainId = await window.ethereum.request({ method: "eth_chainId" });

            // alert(parseInt(_chainId, 16))

            const onAccountsChanged = async (accounts: string[]) => {
                set({
                    browserWeb3Context: {
                        account: accounts[0],
                        chainId: get().browserWeb3Context?.chainId,
                        provider: window.ethereum
                    }
                });
            }
            const onChainChanged = async (chain: any) => {
                //parseInt(chain, 16) 
                set({
                    browserWeb3Context: {
                        account: get().browserWeb3Context?.account,
                        chainId: parseInt(chain, 16),
                        provider: window.ethereum
                    }
                });
            };
            window.ethereum?.on("accountsChanged", onAccountsChanged);
            window.ethereum?.on("chainChanged", onChainChanged);
 
            // const provider = new ethers.providers.Web3Provider(window.ethereum);

            set({
                browserWeb3Context: {
                    account: accounts[0],
                    chainId: parseInt(_chainId, 16),
                    provider: window.ethereum
                },
                isWalletModalOpen: false,
            });

            localStorage.setItem('app_connected', '1');
            localStorage.setItem('app_connect_wallet', 'browser');


        },
        ethPrice:0.17 //cfx
    }

};

