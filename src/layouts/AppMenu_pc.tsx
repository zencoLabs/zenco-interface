import { Avatar, Box, Button, List, ListItemButton, ListItemIcon, SvgIcon, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react"; 
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PostAddIcon from '@mui/icons-material/PostAdd'; 
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LinkIcon from '@mui/icons-material/Link';
import SettingsIcon from '@mui/icons-material/Settings';
import { ExpandLess, ExpandMore } from "@mui/icons-material"; 
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import Link from "next/link";
import { getUserAvatar, textCenterEllipsis } from "../utils/text-center-ellipsis"; 
import { TextWithTooltip } from "../components/FlowCommons/TextWithTooltip";
import { useWeb3React } from "@web3-react/core";
import { ModalType, useModalStore } from "../store/modalSlice";
import { useRootStore } from "../store/root";
import { APIURL, CHAINS, ConnectChainID } from "../libs/chains";
import { useBackgroundDataProvider } from "../hooks/BackgroundDataProvider";
import { useRouter } from "next/router";
import { toastInfo } from "../libs/toastAlert";
import { useTempAssetStore } from "../store/tempAssetSlice"; 

export function AppMenu_pc() {
    const router = useRouter();
    const { connector } = useWeb3React()
    const { setWalletModalOpen, disconnectWallet, account, spaceUserInfo } = useRootStore();
    const { setType } = useModalStore()
    const [open, setOpen] = useState(true);
    const { refetchSpaceUserData } = useBackgroundDataProvider()
    const { tempSelectMemuIndex, setTempSelectMemuIndex } = useTempAssetStore()

    const handleClick = () => {
        setOpen(!open);
    };

    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    useEffect(() => {
        const currentPath = router.pathname;
        switch (currentPath) {
            case '/':
            case '/asset-overview':
                setSelectedIndex(0)
                break;
            case '/space':
                setSelectedIndex(1)
                break;
        }
    }, [])
    useEffect(() => {
        if (tempSelectMemuIndex) {
            setSelectedIndex(tempSelectMemuIndex)
            if (tempSelectMemuIndex > 30 && tempSelectMemuIndex < 40) {
                setOpen(true);
            }
        } 
    }, [tempSelectMemuIndex])

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
        href: string
    ) => {
        setSelectedIndex(index);
        setTempSelectMemuIndex(index)
        if (index == 3) {
            handleClick()
        } else {
            if (index == 0 || index == 1 || index == 2 || index == 31 || index == 33)
                router.push(href)
            else if (index == 34) {
                window.open(href)
            }
            else if (index == 35) {
                handleDisconnect()
            }
            else
                toastInfo(false, 'Coming soon!')
        }

    };

    const handleSwitchWallet = () => {
        setWalletModalOpen(true);
        handleDisconnect()
    };

    const handleDisconnect = async () => {
        await disconnectWallet(connector);
        refetchSpaceUserData && refetchSpaceUserData();
    }

    const { avatar, spacename } = useMemo(
        () => {
            return getUserAvatar(account, spaceUserInfo) //'https://arweave.net/J0EysabH0vBoX2g6wdPQ83VLADufVuZfcMJDgtxOl88'
        },
        [account, spaceUserInfo]
    );
 
    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100vh'
        }}>

            <Box sx={{
                mt: 6,
            }}>
                <Link href="/" style={{
                    display: 'flex',
                    textAlign: 'center',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px 0 12px 20px',
                    gap: '10px',
                    textDecoration: 'none'
                }}> 
                    <img src="/zenco.png" style={{ width: '32px', height: '31px' }} />
                    <Typography variant={"main21"}  className="art-text-logo" sx={{fontSize:'26px !important'}}>Zenco</Typography>
                </Link>

                <List

                    component="nav"
                    aria-labelledby="nested-list-subheader" 
                >
                    <ListItemButton 
                        onClick={(event) => handleListItemClick(event, 0, '/')}
                    > 
                        <ListItemIcon>
                            <HomeIcon fontSize="medium" sx={{
                                color: selectedIndex === 0 ? "text.primary" : "text.secondary"
                            }} />
                        </ListItemIcon>
                        <ListItemText primary="Trending" sx={{
                            color: selectedIndex === 0 ? "text.primary" : "text.secondary",
                            fontSize: '0.985rem'
                        }} /> 
                    </ListItemButton>

                    <ListItemButton
                        onClick={(event) => handleListItemClick(event, 1, '/space')}
                    >
                        <ListItemIcon>
                            <ExploreIcon fontSize="medium" sx={{
                                color: selectedIndex === 1 ? "text.primary" : "text.secondary"
                            }} />
                        </ListItemIcon>
                        <ListItemText primary="Spaces" sx={{
                            color: selectedIndex === 1 ? "text.primary" : "text.secondary",
                            fontSize: '0.985rem'
                        }} />
                    </ListItemButton>

                    <ListItemButton 
                        onClick={(event) => account ? handleListItemClick(event, 2, `/message`) : setWalletModalOpen(true)}
                    >
                        <ListItemIcon>
                            <MessageIcon fontSize="small" sx={{
                                color: selectedIndex === 2 ? "text.primary" : "text.secondary"
                            }} />
                        </ListItemIcon>
                        <ListItemText primary="Messages" sx={{
                            color: selectedIndex === 2 ? "text.primary" : "text.secondary",
                            fontSize: '0.985rem'
                        }} />
                    </ListItemButton>


                    <ListItemButton
                        onClick={(event) => {
                            account ? handleListItemClick(event, 3, '/') : setWalletModalOpen(true)
                        }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon fontSize="medium" sx={{
                                color: selectedIndex === 3 ? "text.primary" : "text.secondary"
                            }} />
                        </ListItemIcon>
                        <ListItemText primary="Account" sx={{
                            color: selectedIndex === 3 ? "text.primary" : "text.secondary",
                            fontSize: '0.985rem'
                        }} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
 
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 8 }}
                                onClick={(event) => account ? handleListItemClick(event, 31, `/space-overview?address=${account}&menu=1`) : setWalletModalOpen(true)}
                            >
                                <ListItemIcon>
                                    <PostAddIcon fontSize="medium" sx={{
                                        color: selectedIndex === 31 ? "text.primary" : "text.secondary"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Space" sx={{
                                    color: selectedIndex === 31 ? "text.primary" : "text.secondary",
                                    fontSize: '0.985rem'
                                }} />
                            </ListItemButton>
  
                            <ListItemButton sx={{ pl: 8 }}
                                onClick={(event) => account ? handleListItemClick(event, 33, `/holdings?address=${account}&menu=1`) : setWalletModalOpen(true)}
                            >
                                <ListItemIcon>
                                    <AccountBalanceWalletIcon fontSize="medium" sx={{
                                        color: selectedIndex === 33 ? "text.primary" : "text.secondary"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Holdings" sx={{
                                    color: selectedIndex === 33 ? "text.primary" : "text.secondary",
                                    fontSize: '0.985rem'
                                }} />
                            </ListItemButton>

                            <ListItemButton sx={{ pl: 8 }}
                                onClick={(event) => handleListItemClick(event, 34, `${CHAINS[ConnectChainID].blockExplorerUrls![0]}/address/${account}`)}
                            >
                                <ListItemIcon>
                                    <LinkIcon fontSize="medium" sx={{
                                        color: selectedIndex === 34 ? "text.primary" : "text.secondary"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="View on Explorer" sx={{
                                    color: selectedIndex === 34 ? "text.primary" : "text.secondary",
                                    fontSize: '0.985rem'
                                }} />
                            </ListItemButton>

                            <ListItemButton sx={{ pl: 8 }}
                                onClick={(event) => handleListItemClick(event, 35, '/')}
                            >
                                <ListItemIcon>
                                    <ExitToAppIcon fontSize="medium" sx={{
                                        color: selectedIndex === 35 ? "text.primary" : "text.secondary"
                                    }} />
                                </ListItemIcon>
                                <ListItemText primary="Disconnect Wallet" sx={{
                                    color: selectedIndex === 35 ? "text.primary" : "text.secondary",
                                    fontSize: '0.985rem'
                                }} />
                            </ListItemButton>



                        </List>
                    </Collapse>

                    <ListItemButton
                        onClick={(event) => handleListItemClick(event, 4, '/')}
                    >
                        <ListItemIcon>
                            <SettingsIcon fontSize="medium" sx={{
                                color: selectedIndex === 4 ? "text.primary" : "text.secondary"
                            }} />
                        </ListItemIcon>
                        <ListItemText primary="Settings" sx={{
                            color: selectedIndex === 4 ? "text.primary" : "text.secondary",
                            fontSize: '0.985rem'
                        }} />
                    </ListItemButton> 

                </List>
            </Box>
            <Box sx={{
                mb: 4
            }}>
                {
                    account && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            // alignItems: 'center'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                cursor: 'pointer'
                            }}
                                component={'div'}
                                onClick={() => { setType(ModalType.UserInfo) }}
                            > 
                                <Avatar alt="" src={avatar} />
                               
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                                    <Typography variant="main16" color="text.main">
                                        {spacename}
                                    </Typography>

                                    <Typography variant="secondary12" color="text.secondary">
                                        {textCenterEllipsis(account, 4, 4)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{
                                marginRight: 2,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <TextWithTooltip
                                    icon={
                                        <MoreVertIcon fontSize="medium" sx={{
                                            color: '#f9ffff',
                                        }} />
                                    }
                                    iconSize={20} 
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>


                                        <Button
                                            variant="surface_1"
                                            onClick={handleSwitchWallet}
                                        >
                                            Switch wallet
                                        </Button>

                                        <Button
                                            variant="surface_1"
                                            onClick={() => {
                                                handleDisconnect()
                                            }}

                                        >
                                            Disconnect
                                        </Button>
                                    </Box>
                                </TextWithTooltip>
                            </Box>


                        </Box>
                    )
                }


            </Box>
        </Box>
    );
}