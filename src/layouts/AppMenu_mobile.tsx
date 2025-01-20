import { AppBar, Avatar, Box, Button, Container, Drawer, IconButton, Link, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useMemo, useState } from "react";
import { useTempAssetStore } from "../store/tempAssetSlice";
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
import { useWeb3React } from "@web3-react/core";
import { useRootStore } from "../store/root";
import { useBackgroundDataProvider } from "../hooks/BackgroundDataProvider";
import { useRouter } from "next/router";
import { toastInfo } from "../libs/toastAlert";
import { getUserAvatar, textCenterEllipsis } from "../utils/text-center-ellipsis";
import { ModalType, useModalStore } from "../store/modalSlice";
import { spaceActive } from "../utils/checkAddress";
import { CHAINS, ConnectChainID } from "../libs/chains";
import { AppRight_media } from "./AppRight_media";

export function AppMenu_mobile() {

    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpenDrawer(newOpen);
    };

    const router = useRouter();
    const { connector } = useWeb3React()
    const { setWalletModalOpen, disconnectWallet, account, spaceUserInfo } = useRootStore();
    const { setType } = useModalStore()
    const { refetchSpaceUserData } = useBackgroundDataProvider()


    const [open, setOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { tempSelectMemuIndex, setTempSelectMemuIndex } = useTempAssetStore()

    const handleClick = () => {
        setOpen(!open);
    };


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
            toggleDrawer(false)
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



    const handleDisconnect = async () => {
        await disconnectWallet(connector);
        refetchSpaceUserData && refetchSpaceUserData();
    }


    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const { avatar, spacename } = useMemo(
        () => {
            return getUserAvatar(account, spaceUserInfo) //'https://arweave.net/J0EysabH0vBoX2g6wdPQ83VLADufVuZfcMJDgtxOl88'
        },
        [account, spaceUserInfo]
    );


    async function handleCreate() {
        if (!account) {
            setWalletModalOpen(true)
            return
        }

        const isActiveSpace = spaceActive(spaceUserInfo)
        if (!isActiveSpace) {
            setType(ModalType.UserInfo)
            return
        }
        router.push('/mobile-blogeditor')
    }

    return <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{
                borderRadius: '0px',
                backgroundColor: '#000000',
            }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon fontSize="large" />
                    </IconButton>

                    <Box component="div" sx={{ flexGrow: 1, display: "flex", justifyContent: 'center' }}>
                        {
                            !account ? <Box>
                                <Typography variant={'h4'} className="art-text-logo">ZENCO</Typography>
                            </Box>
                                : <>

                                </>
                        }
                    </Box>

                    {
                        !account ? <Button color="inherit" sx={{ fontSize: '18px' }} onClick={() => { setWalletModalOpen(true) }}>Login</Button>
                            : <Box sx={{ display: "flex", flexGrow: 0, gap: '20px' }}>
                                <IconButton onClick={() => handleCreate()} sx={{ p: 0 }}>
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3724" width="24" height="24"><path d="M425.396383 555.773581 431.371301 561.74849 852.57519 140.54461 814.060439 102.029857 392.856547 523.233737 397.485239 527.862435 355.764622 678.571814 495.194066 647.358507 496.733003 648.897427 499.159706 646.470743 501.690154 645.904253 500.789814 644.840622 925.298594 220.331836 886.783842 181.817091 465.477263 603.123668 425.396383 555.773581 425.396383 555.773581ZM44.988027 196.085106 12.307176 196.085106 12.307176 1023.999999 44.988027 1023.999999 840.222068 1023.999999 840.222068 991.319148 840.222068 991.319148 840.222068 370.382978 796.6476 392.170212 796.6476 980.425531 55.881644 980.425531 55.881644 980.425531 55.881644 239.659574 644.136962 239.659574 665.924196 196.085106 44.988027 196.085106 44.988027 196.085106ZM884.769233 27.03553C901.827657 9.977109 929.364418 9.856704 946.619979 27.112265L1000.236757 80.729042C1017.337559 97.829842 1017.429165 125.464114 1000.313491 142.579788L954.170992 188.722287 838.626735 73.178029 884.769233 27.03553Z" fill="#75cedb" p-id="3725"></path></svg>
                                </IconButton>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="" src={avatar} sx={{ width: '28px', height: '28px' }} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{
                                        mt: '40px',
                                        '& .MuiMenu-paper': {
                                            backgroundColor: '#000000',
                                        },
                                    }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    PaperProps={{
                                        sx: {
                                            //   minWidth: '120px',
                                            //   py: 0,
                                        },
                                    }}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 2,
                                            cursor: 'pointer',
                                            minWidth: '200px'
                                        }}
                                            component={'div'}
                                            onClick={() => { setType(ModalType.UserInfo) }}
                                        >
                                            <Avatar alt="" src={avatar} sx={{ width: '36px', height: '36px' }} />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                                                <Typography variant="main16" color="text.main">
                                                    {spacename}
                                                </Typography>

                                                <Typography variant="secondary12" color="text.secondary">
                                                    {textCenterEllipsis(account, 4, 4)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>

                                    <MenuItem onClick={handleCloseUserMenu} sx={{ padding: '2px 6px', minHeight: '32px' }}>
                                        <Button
                                            variant="text"
                                            onClick={() => {
                                                setType(ModalType.UserInfo)
                                            }}
                                            sx={{
                                                backgroundColor: 'transparent',
                                                '& span': {
                                                    display: 'none',
                                                },
                                            }}
                                        >
                                            Profile
                                        </Button>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseUserMenu} sx={{ padding: '2px 6px', minHeight: '32px' }}>
                                        <Button
                                            variant="text"
                                            onClick={() => {
                                                handleDisconnect()
                                            }}
                                            sx={{
                                                backgroundColor: 'transparent',
                                                '& span': {
                                                    display: 'none',
                                                },
                                            }}
                                        >
                                            Disconnect
                                        </Button>
                                    </MenuItem>
                                </Menu>
                            </Box>
                    }
                </Toolbar>
            </AppBar>
        </Box>

        <Drawer open={openDrawer} onClose={toggleDrawer(false)}
            sx={{}}
            PaperProps={{
                sx: {
                    background: '#26244b',
                    borderRadius: 'unset',
                },
            }}
        >
            <Box sx={{ display: 'flex', width: 250, flex: 1 }} role="presentation">
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1
                }}>
                    <Box sx={{
                        mt: 6,
                    }}>
                        <Link href="/" style={{
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            padding: '0px 0 12px 20px',
                            gap: '10px',
                            textDecoration: 'none'
                        }}
                            onClick={toggleDrawer(false)}
                        >
                            <img src="/zenco.png" style={{ width: '26px', height: '25px' }} />
                            <Typography variant={"main21"} className="art-text-logo">Zenco</Typography>
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

                            <Box sx={{
                                mt: 6,
                                p: 2,
                            }}>
                                <Button
                                    onClick={() => {
                                        window.open('https://predict.zenco.club/')
                                    }}
                                    sx={(theme) => ({
                                        background: 'linear-gradient(87deg, #DB455F -1.64%, #D2AB94 111.87%)',
                                        height: '75px',
                                        width: '100%',
                                        transition: 'all 0.2s ease 0s',
                                        padding: '1rem 0px 1rem 1rem',
                                        justifyContent: 'flex-start',
                                        alignItems:'center',
                                        display: 'flex',
                                        gap:'4px'
                                    })}
                                >
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4186" width="32" height="32"><path d="M601.8 779l0-2.00000001c0-14.9-4.3-27.1-11.6-38.89999998 30-10.3 51.7-36.5 51.7-70.20000001 0-14.9-4.3-29.1-11.6-40.9 30-10.3 51.7-36.5 51.7-70.2 0-13.2-3.3-25.4-9.1-36.2l77.3 0c42.1 0 76.2-31.8 76.2-74.2 0-42.4-34.1-76.7-76.2-76.7l-295.8 0L500.8 323.00000001c29.79999999-30 25.5-83 0-108.60000001-25.5-25.5-76.9-42.3-113.4-5.7L174.5 422.99999999c-4.4 4.4-8.1 9.3-11.1 14.40000001-31.9 39.09999999-50.8 83.9-50.8 178.6 0 216.3 116.7 236.4 260.7 236.40000001L525.6 852.4c42.1 0 76.2-31 76.2-73.4z m-228.59999999 33c-121.8 0-220.6-0.6-220.60000001-196 0-82.8 18.5-132.5 55.8-170.1L410 243c18-18 40.9-13.4 55.6 1.3 14.7 14.7 15.2 41.7 1.1 55.9l-65.9 66.3-43.4 43.6L742.1 410.1c19.90000001 0 36.1 16.3 36.1 36.4 0 20.1-16.2 33.8-36.1 33.80000001l-244.7-1e-8 0 0.39999999c-1.3-0.3-2.6-0.4-4-0.39999998-11.1 0-20.1 9-20.1 20.19999999 0 11.1 9 20.2 20.1 20.20000001 1.39999999 0 2.7-0.1 4-0.40000001l0 0.4L597.8 520.7c19.90000001 0 36.1 14.5 36.1 34.6 0 0 0.5 35.6-36.1 35.6l-132.3 0 0 0.4c-1.3-0.3-2.6-0.4-4-0.39999999-11.1 0-20.1 9-20.1 20.19999999s9 20.2 20.1 20.20000001c1.39999999 0 2.7-0.1 4-0.40000001l0 0.4 92.3 0c19.90000001 0 36.1 14.3 36.1 34.4 0 0-2.3 36.3-36.1 36.3l-116.3 0 0 0.4c-1.3-0.3-2.6-0.4-4-0.4-11.1 0-19.99999999 9-20 20.2s9 19.7 20 19.7c1.39999999 0 2.7-0.1 4-0.4l0 0.4 79.4 0c19.90000001 0 36.1 15 36.1 35.1 0 0 1.4 35.2-36.1 35.2l-147.69999999-0.2zM636.5 339.6l67.4 0c14.8-6.6 30.8-10 47-10.1 63.9 0 115.6 51.8 115.6 115.6 0 63.9-51.8 115.6-115.6 115.6-8.5 0-17-1-25.4-2.9-0.5 14-6.3 27.3-16.3 37.2 13.3 3.7 27.2 5.9 41.7 5.9 86.1 0 155.8-69.8 155.8-155.80000001 0-86.1-69.8-155.8-155.9-155.79999999-45.1 0-85.8 19.5-114.3 50.3z m0 0" fill="#ffffff" p-id="4187"></path></svg>

                                    <Typography variant={'h3'} sx={{ lineHeight: '20px', textAlign: 'left' }}>Prediction Market </Typography>

                                </Button>

                            </Box>

                        </List>
                    </Box>

                    <Box sx={{
                        mb: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <AppRight_media />
                    </Box>
                </Box>
            </Box>



        </Drawer>

    </>
}

