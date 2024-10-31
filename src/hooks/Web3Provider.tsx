import React, { ReactElement } from 'react'; 
import { ModalType, useModalStore } from "@/src/store/modalSlice"
import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { ConnectChainID } from '../libs/chains'; 
import { eip6963Connection, getConnection } from '../connection';
import { Connection, ConnectionType } from '../connection/types';
import { ethers } from 'ethers';
import { useRootStore } from '../store/root';
 
export const Web3Context = React.createContext(null);
export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {


    const { chainId: ethChainId, account: ethAccount, provider: ethProvider } = useWeb3React()
    const { fluentWeb3Context, fluentConnectWallet, browserWeb3Context, browserConnectWallet, setConnectInfo } = useRootStore()
    const app_connect_wallet = typeof window !== "undefined" && localStorage.getItem('app_connect_wallet');
 
    let chainId = app_connect_wallet == 'fluent' ? fluentWeb3Context?.chainId : app_connect_wallet == 'browser' ? browserWeb3Context?.chainId : ethChainId

    const { type, close, setType } = useModalStore()

    useEffect(() => {
        const connected = typeof window !== "undefined" && localStorage.getItem('app_connected')
        if (connected === '1') {
            if (app_connect_wallet == 'fluent') {
                fluentConnectWallet()
            }
            else if (app_connect_wallet == 'browser') {
                browserConnectWallet()
            }
            else {
                const connect_rnds = typeof window !== "undefined" && localStorage.getItem('app_connect_rnds')
                if (connect_rnds && connect_rnds !== '') {
                    eip6963Connection.selectRdns(connect_rnds)
                }

                const connectType = typeof window !== "undefined" && localStorage.getItem('app_connect_type')
                const ethsslConnection = getConnection(connectType as ConnectionType)

                if (ethsslConnection) {
                    ethsslConnection.overrideActivate?.(chainId ?? ConnectChainID)  //It has to be, otherwise it won't load the initial values.

                    connect(ethsslConnection)
                        .then((connected) => {
                            // if (!connected) throw new FailedToConnect()  
                        })

                }
            } 
        }
    }, [])



    useEffect(() => {
        if (chainId && chainId !== 0) { 

            if (chainId !== ConnectChainID && !type) {
                setType(ModalType.NetworkWarning)
            } else {
                if (type == ModalType.NetworkWarning)
                    close()
            }
        }
    }, [chainId])

    async function connect(connection: Connection) {
        try {
            if (connection.connector.connectEagerly) {
                await connection.connector.connectEagerly()
            } else {
                await connection.connector.activate()
            } 
            return true
        } catch (error) {
            return false
        } finally {
        }
    }
 
    let account = app_connect_wallet == 'fluent' ? fluentWeb3Context?.account : app_connect_wallet == 'browser' ? browserWeb3Context?.account : ethAccount
 
    useEffect(() => {
        if(account){ 
            let signer = app_connect_wallet == 'fluent' ? new ethers.providers.Web3Provider(fluentWeb3Context?.provider).getSigner() :
            app_connect_wallet == 'browser' ? new ethers.providers.Web3Provider(browserWeb3Context?.provider).getSigner() :
                ethProvider?.getSigner(account).connectUnchecked()
 
            setConnectInfo(account, signer)
        }
       
    }, [account])


    return (
        <Web3Context.Provider
            value={null}
        >
            {children}
        </Web3Context.Provider>
    );

};





