import { Box, Button, Typography } from '@mui/material';
import { TxModalTitle } from '../FlowCommons/TxModalTitle'; 
import { WalletType } from '@/src/libs/networksConfig';
import { useWeb3React } from "@web3-react/core";
import { useOrderedConnections } from './useOrderedConnections';
import { Connection, ConnectionType } from '@/src/connection/types';
import { useState } from 'react';
import { useRootStore } from '@/src/store/root';
import { isMobile } from 'react-device-detect';

export type WalletRowProps = {
  walletName: string;
  walletType: WalletType;
  connect?: Connection;
  url: string;
}

const getWalletIcon = (walletType: WalletType) => {
  switch (walletType) {
    case WalletType.INJECTED:
      return (
        <img
          src={`/icons/wallets/metamask.svg`}
          width="24px"
          height="24px"
          alt={`browser wallet icon`}
        />
      ); 
    case WalletType.OKX:
      return (
        <img
          src={`/icons/wallets/okx.png`}
          width="24px"
          height="24px"
          alt={`browser wallet icon`}
          style={{ 'borderRadius': '6px' }}
        />
      );
    case WalletType.FLUENT:
      return (
        <img
          src={`/icons/wallets/fluent.svg`}
          width="24px"
          height="24px"
          alt={`browser wallet icon`}
        />
      );
    case WalletType.BROWSER:
      return (
        <img
          src={`/icons/wallets/browserWallet.svg`}
          width="24px"
          height="24px"
          alt={`browser wallet icon`}
        />
      );
    default:
      return null;
  }
};


const WalletRow = ({ walletName, walletType, connect, url }: WalletRowProps) => {

  const { chainId } = useWeb3React()
  const { connectWallet, fluentConnectWallet, browserConnectWallet } = useRootStore();

  const [doInfo, setDo] = useState('')

  const ethConnectWalletClick = async (connect?: Connection) => {

    if (walletType == WalletType.FLUENT) {
      const provider = window.conflux 
      if (provider && provider.isFluent) {
        fluentConnectWallet()
      } else {
        window.open(url, '_blank')
      }

    }
    else if (walletType == WalletType.BROWSER) {
      browserConnectWallet()
    }
    else {
      if (!connect) {
        window.open(url, '_blank')
      } else {
        connectWallet(connect!, function () {
        }, chainId)
      }
    }
  };

  return (
    <Button
      // variant="contained"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        mb: '8px',
        background: '#444270'
      }}
      size="large"
      onClick={() => ethConnectWalletClick(connect)}
      endIcon={getWalletIcon(walletType)}
    >
      {walletName} {doInfo}
    </Button>
  );
};

export enum ErrorType {
  UNSUPORTED_CHAIN,
  USER_REJECTED_REQUEST,
  UNDETERMINED_ERROR,
  NO_WALLET_DETECTED,
  NOT_ENOUGH_BALANCE
}

export enum CollateralType {
  ENABLED,
  DISABLED,
  UNAVAILABLE,
}


export const WalletSelector = () => {
  const { orderedConnections } = useOrderedConnections() 
  const listWallet = isMobile ? orderedConnections : orderedConnections.filter((c) => c.type !== ConnectionType.INJECTED)
 
  return (
    <>
     
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <TxModalTitle title={"Connect a wallet"} /> 
        <WalletRow
          key="MetaMask_wallet"
          walletName="MetaMask"
          walletType={WalletType.INJECTED} 
          connect={listWallet.find((g) => g.getProviderInfo().name == 'MetaMask')}
          url="https://metamask.io/"
        />
       
        <WalletRow
          key="OKX_wallet"
          walletName="OKX Wallet"
          walletType={WalletType.OKX}
          connect={listWallet.find((g) => g.getProviderInfo().name == 'OKX Wallet')}
          url="https://www.okx.com/"
        />

        <WalletRow
          key="Fluent_wallet"
          walletName="Fluent"
          walletType={WalletType.FLUENT}
          connect={listWallet.find((g) => g.getProviderInfo().name == 'Fluent')}
          url="https://fluentwallet.com/"
        />

        <WalletRow
          key="browser_wallet"
          walletName="Other"
          walletType={WalletType.BROWSER} 
          url="/"
        />
 
      </Box>
    </>
  );
};
