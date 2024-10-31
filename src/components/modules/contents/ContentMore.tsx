import { Box, IconButton, ListItemText, Menu, MenuItem, SvgIcon, Typography } from "@mui/material" 
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; 
import { useState } from "react"; 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareIcon from '@mui/icons-material/Share';
import { toastInfo } from "@/src/libs/toastAlert";
import { useRootStore } from "@/src/store/root";
import { BlogContract, ConnectChainID } from "@/src/libs/chains";
import { BigNumber, Contract } from "ethers";
import bodhiABI from '@/src/abis/bodhi.json';
import { AssetInfo } from "@/src/libs/model";
import { useBackgroundDataProvider } from "@/src/hooks/BackgroundDataProvider";

export const ContentMore = ({
    assetId,
    assetData
}: {
    assetId: number,
    assetData: AssetInfo
}) => {

    const { account, signer, spaceUserInfo } = useRootStore()
    const { refetchBodhiData } = useBackgroundDataProvider()
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function deleteSigner() {
        try {

            const bodhiStr = BlogContract[ConnectChainID].bodhi
            const bodhiContract = new Contract(bodhiStr, bodhiABI, signer) //  


            const txObject = {
                from: account,
                to: bodhiStr, //  
                value: BigNumber.from(0),
                data: bodhiContract.interface.encodeFunctionData('remove', [assetId]), //  
            };
            const gasLimit = await bodhiContract.provider.estimateGas(txObject)
            console.log('gasLimit:', gasLimit.toNumber());

            const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

            sendPromise?.then((txResponse) => { 
                //
                txResponse.wait().then((receipt) => { 
                    if (receipt.status === 1) {
                        toastInfo(true, 'Remove Success.')

                    } else {
                        toastInfo(false, 'Confirm failure.')
                    }

                    refetchBodhiData && refetchBodhiData()
                }).catch((error) => {
                    toastInfo(false, error.reason);
                })
            }).catch((error) => {
                toastInfo(false, error.reason);
            })
        } catch (error) {
            if (error.code === -32603 && error.data.code == -32015) {
                toastInfo(false, 'Insufficient funds for gas.');
            } else {
                toastInfo(false, 'Confirm failure.')
            }
        }
    } 

    return (
        <Box>
            <IconButton
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    p: 0,
                    minWidth: 0,
                }}
                onClick={handleClick}
            >
                <SvgIcon
                    sx={{
                        fontSize: 18,
                        color: open ? 'info.main' : 'text.muted',
                        borderRadius: '50%',
                        '&:hover': 'info.main'
                    }}
                >
                    <MoreHorizIcon fontSize="medium" sx={{
                        color: '#d7e2e3',
                    }} />
                </SvgIcon>
            </IconButton>


            <Menu
                id="withdraw-item-extra-menu"
                anchorEl={anchorEl}
                open={open} 
                onClose={handleClose}
                keepMounted={true}
                PaperProps={{
                    sx: {
                        minWidth: '120px',
                        py: 0,
                    },
                }}
                sx={{ 
                    '& .MuiMenu-paper': {
                        backgroundColor: '#2e2c56',
                        boxShadow: "3px 3px 2px #1e1d35"
                    },
                }}
            >
                <MenuItem
                    sx={{ gap: 2 }}
                    onClick={() => {
                        handleClose();
                        toastInfo(false, ' Coming soon!')
                    }}
                >
                    <ShareIcon color={"info"} fontSize={"small"} />
                    <Typography sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <ListItemText sx={{
                            // color: '#3c3939',
                        }}>
                            Share on
                        </ListItemText>
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{
                            height: '14px',
                        }}><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                            fill="#ffffff"></path></g></svg>
                    </Typography>
                </MenuItem>

                {
                    account == assetData.creator?.address && spaceUserInfo?.descriptionAssetId !== assetId.toString() ?
                        <MenuItem
                            sx={{ gap: 2 }}
                            onClick={() => {
                                handleClose();
                                deleteSigner()
                            }}
                        >
                            <DeleteOutlineIcon color={"error"} fontSize={"small"} />
                            <ListItemText sx={{
                                color: '#ff0000'
                            }}>Delete</ListItemText>
                        </MenuItem>
                        : <></>
                }
 
            </Menu>

        </Box>
    )

}