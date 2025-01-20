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
        window.open('https://predict.zenco.club/','_blank')
      }}
        sx={(theme) => ({ 
          mb: 6,
          background: 'linear-gradient(87deg, #DB455F -1.64%, #D2AB94 111.87%)',
          height: '75px',
          width:'100%',
          transition: 'all 0.2s ease 0s',
          padding: '1rem 0px 1rem 1rem',
          justifyContent: 'flex-start',
          alignItems:'center',
          display: 'flex',
          gap:'4px'
        })}
      >
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4186" width="32" height="32"><path d="M601.8 779l0-2.00000001c0-14.9-4.3-27.1-11.6-38.89999998 30-10.3 51.7-36.5 51.7-70.20000001 0-14.9-4.3-29.1-11.6-40.9 30-10.3 51.7-36.5 51.7-70.2 0-13.2-3.3-25.4-9.1-36.2l77.3 0c42.1 0 76.2-31.8 76.2-74.2 0-42.4-34.1-76.7-76.2-76.7l-295.8 0L500.8 323.00000001c29.79999999-30 25.5-83 0-108.60000001-25.5-25.5-76.9-42.3-113.4-5.7L174.5 422.99999999c-4.4 4.4-8.1 9.3-11.1 14.40000001-31.9 39.09999999-50.8 83.9-50.8 178.6 0 216.3 116.7 236.4 260.7 236.40000001L525.6 852.4c42.1 0 76.2-31 76.2-73.4z m-228.59999999 33c-121.8 0-220.6-0.6-220.60000001-196 0-82.8 18.5-132.5 55.8-170.1L410 243c18-18 40.9-13.4 55.6 1.3 14.7 14.7 15.2 41.7 1.1 55.9l-65.9 66.3-43.4 43.6L742.1 410.1c19.90000001 0 36.1 16.3 36.1 36.4 0 20.1-16.2 33.8-36.1 33.80000001l-244.7-1e-8 0 0.39999999c-1.3-0.3-2.6-0.4-4-0.39999998-11.1 0-20.1 9-20.1 20.19999999 0 11.1 9 20.2 20.1 20.20000001 1.39999999 0 2.7-0.1 4-0.40000001l0 0.4L597.8 520.7c19.90000001 0 36.1 14.5 36.1 34.6 0 0 0.5 35.6-36.1 35.6l-132.3 0 0 0.4c-1.3-0.3-2.6-0.4-4-0.39999999-11.1 0-20.1 9-20.1 20.19999999s9 20.2 20.1 20.20000001c1.39999999 0 2.7-0.1 4-0.40000001l0 0.4 92.3 0c19.90000001 0 36.1 14.3 36.1 34.4 0 0-2.3 36.3-36.1 36.3l-116.3 0 0 0.4c-1.3-0.3-2.6-0.4-4-0.4-11.1 0-19.99999999 9-20 20.2s9 19.7 20 19.7c1.39999999 0 2.7-0.1 4-0.4l0 0.4 79.4 0c19.90000001 0 36.1 15 36.1 35.1 0 0 1.4 35.2-36.1 35.2l-147.69999999-0.2zM636.5 339.6l67.4 0c14.8-6.6 30.8-10 47-10.1 63.9 0 115.6 51.8 115.6 115.6 0 63.9-51.8 115.6-115.6 115.6-8.5 0-17-1-25.4-2.9-0.5 14-6.3 27.3-16.3 37.2 13.3 3.7 27.2 5.9 41.7 5.9 86.1 0 155.8-69.8 155.8-155.80000001 0-86.1-69.8-155.8-155.9-155.79999999-45.1 0-85.8 19.5-114.3 50.3z m0 0" fill="#ffffff" p-id="4187"></path></svg>

        <Typography variant={'h3'} sx={{lineHeight:'20px',textAlign:'left'}}>Prediction Market </Typography>
        {/* <img src="/images/UsElectionForecast.webp" height={70}/> */}
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