import { Alert, Box, Button, Divider, Fab, Paper, Typography, useTheme } from "@mui/material";
import { FormattedNumber } from "../components/primitives/FormattedNumber";
import { BottomInfoPanelItem } from "../components/primitives/BottomInfoPanelItem";
import { useRootStore } from "../store/root";
import { useGetUserInfo } from "../hooks/bodhi/useGraphData";
import { EADDRESS } from "../libs/tokens";
import { useEffect, useMemo } from "react";
import GavelIcon from '@mui/icons-material/Gavel';
import Link from "next/link";
import { Height } from "@mui/icons-material";

export function AppRight_pc() {
  const theme = useTheme()
  const { account, setWalletModalOpen, ethPrice, currentTimestamp } = useRootStore()

  const { userInfo, error: userError, refetch: userRefetch } = useGetUserInfo(account ?? EADDRESS)

  useEffect(() => {
    userRefetch()
  }, [currentTimestamp, userRefetch])


  async function handleWalletClick() {
    if (!account) {
      setWalletModalOpen(true);
    }
  }


  return <>
    <Box>
      <Button 
      onClick={()=>{
        window.open('https://election2024.zenco.club/prediction/0','_blank')
      }}
        sx={(theme) => ({ 
          mb: 6,
          background: 'linear-gradient(87deg, #DB455F -1.64%, #D2AB94 111.87%)',
          height: '75px',
          width:'100%',
          transition: 'all 0.2s ease 0s',
          padding: '1rem 0px 1rem 1rem',
          justifyContent: 'space-between',
          alignItems:'center',
          display: 'flex'
        })}
      >
        <Typography variant={'h3'} sx={{lineHeight:'20px',textAlign:'left'}}>2024 Election<br/>Forecast </Typography>
        <img src="/images/UsElectionForecast.webp" height={70}/>
      </Button>

      <Paper
        sx={(theme) => ({
          padding: '12px',
          background: 'transparent',
          border: '1px solid #434b59'
        })}
      >

        <Typography variant="h3" color={'#75cedb'} sx={{}}>
          My assets
        </Typography>
        <Divider sx={{ mb: 4, mt: 2 }} />

        {
          !account ?
            <Button variant="surface" size="large"
              onClick={handleWalletClick}
              sx={{ 
                width: '100%'
              }}
            >Connect Wallet</Button>
            :
            <>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: ' repeat(2, 3fr)',
                gridGap: '4px',
                minHeight: '40px'
              }}>
                <Box sx={{
                }}>
                  <BottomInfoPanelItem title={<>Assets</>} hideIcon variant={'secondary14'}>
                    <FormattedNumber
                      value={userInfo?.totalAssets ?? 0}
                      // symbol="USD"
                      variant={'main16'}
                      symbolsVariant={'secondary16'}
                      visibleDecimals={0}
                    />
                  </BottomInfoPanelItem>
                </Box>
                <Box sx={{
                }}>
                  <BottomInfoPanelItem title={<>Holders</>} hideIcon variant={'secondary14'}>
                    <FormattedNumber
                      value={userInfo?.totalHolders ? (Number(userInfo.totalHolders) + 1) : 1}
                      variant={'main16'}
                      symbolsVariant={'secondary16'}
                      visibleDecimals={0}
                      color={'text.primary'}
                      symbolsColor={'text.primary'}
                    />
                  </BottomInfoPanelItem>
                </Box> 
              </Box> 

            </>

        }








      </Paper >
    </Box>

    <Alert severity="info" icon={<></>} sx={{
      mt: '24px', mb: '6px', display: 'flex',
      ".MuiAlert-icon": {
        display: 'none'
      }

    }}>
      The Zenco project is inspired by the Bodhi protocol. Special thanks to the founder of Bodhi for their innovative approach to decentralized content incentivization.
      
    </Alert>

    <Alert severity="warning" icon={<>
      <GavelIcon />
    </>} sx={{
      mt: '24px', mb: '6px', display: 'flex',
      // ".MuiAlert-icon": {
      //   display: 'none'
      // } 
    }}>
      <Link href={`/terms`} style={{ textDecoration: 'none' }}>Terms of Service</Link>
    </Alert> 
  </>
}