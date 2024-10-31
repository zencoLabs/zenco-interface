import { Box, Button, Typography } from "@mui/material";
import { ReactNode } from "react";
import { AppMenu_pc } from "./AppMenu_pc";
import { AppMenu_mobile } from "./AppMenu_mobile";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { AppRight_pc } from "./AppRight_pc";
import { useRootStore } from "../store/root";
import { AppRight_media } from "./AppRight_media";
import { isMobile } from 'react-device-detect';

export function MainLayout({ children }: { children: ReactNode }) { 
    const { setWalletModalOpen, account } = useRootStore()

    async function handleWalletClick() {
        if (!account) {
            setWalletModalOpen(true);
        }
    }


    return (
        <>

            <Box sx={{
                margin: '0px auto',
                width: !isMobile ? '1024px' : '100%', 
                pl: '0',
                pr: '0'
            }}>
                {
                    !isMobile ?
                        <Box sx={{
                            display: 'flex', 
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            <Box sx={{
                                width: '230px',
                                flexBasis: '230px',
                                flexShrink: '0',
                                justifyContent: 'flex-end', 
                                marginRight: '20px',
                            }}>
                                <Box sx={{
                                    width: '230px',
                                    height: '100vh',
                                    position: 'fixed',
                                    top: 0,
                                    overflow: 'hidden',
                                    borderRight: '1px solid  #434b59'
                                }}>
                                    <AppMenu_pc />
                                </Box>
                            </Box>
                            <Box sx={{
                                flex: 1,
                                overflowY: 'auto', 
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'row',
                                    mt: 6,
                                    mb: 4,
                                }}>
                                    <Box sx={{ 
                                        flex: 1, 
                                    }}>{children}</Box>
                                    <Box sx={
                                        {
                                            width: '240px',
                                            marginLeft: '20px',  
                                        }
                                    }>
                                        <AppRight_pc />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        :
                        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <AppMenu_mobile />
                            <Box sx={{
                                pl: '10px',
                                pr: '10px',
                                pt:'80px',
                                pb:'10px'
                            }}>
                                {children}
                            </Box>
                        </Box>
                } 
            </Box> 
            {
                !isMobile && (
                    <>
                        {
                            !account ? (
                                <Box sx={{
                                    position: 'fixed',
                                    width: '100%',
                                    height: !isMobile ? '120px' : '80px',
                                    background: '#5d5cdc',
                                    bottom: 0
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        gap: 2
                                    }}>
                                        <Typography fontSize={'16px'}>Zonco makes content tradable. Each piece is like a mini-company. You buy and sell its shares directly with Zonco. </Typography>
                                        <Button variant="surface" size="large"
                                            onClick={handleWalletClick}
                                            startIcon={
                                                <AccountBalanceWalletIcon fontSize="small" />
                                            }
                                        >Connect Wallet</Button>
                                    </Box>
                                </Box>

                            ) :
                                <Box sx={{
                                    position: 'fixed', 
                                    bottom: '16px',
                                    right: '2%'
                                }}>
                                    <AppRight_media />
                                </Box>
                        }
                    </>
                )
            }


            {/* <Box component={'div'}
                id='background-radial-gradient'
                sx={{
                    background: (theme) => theme.palette.background.main,
                }}
            >
            </Box> */}

        </>
    );
}