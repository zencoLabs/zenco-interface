import { Box, IconButton, ListItemText, Menu, MenuItem, SvgIcon } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; 
import { toastInfo } from "@/src/libs/toastAlert";
import { useRootStore } from "@/src/store/root"; 
import { BigNumber, Contract } from "ethers";
import spaceABI from '@/src/abis/space.json';
import { useBackgroundDataProvider } from "@/src/hooks/BackgroundDataProvider";
import { SpaceReply } from "@/src/libs/model";

export const ContentReplyMore = ({
    replyInfo
}: {
    replyInfo: SpaceReply
}) => {

    const { account, signer } = useRootStore()
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
            const spaceAddress = replyInfo.spaceFactory.spaceAddress
            const spaceContract = new Contract(spaceAddress!, spaceABI, signer) //    

            const txObject = {
                from: account,
                to: spaceAddress, //  
                value: BigNumber.from(0),
                data: spaceContract.interface.encodeFunctionData('removeFromBodhi', [replyInfo.parentId,replyInfo.assetId]), //  
            };
            const gasLimit = await spaceContract.provider.estimateGas(txObject)
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
                // MenuListProps={{
                //   'aria-labelledby': 'supply-extra-button',
                //   sx: {
                //     py: 0,
                //   },
                // }}
                onClose={handleClose}
                keepMounted={true}
                PaperProps={{
                    sx: {
                        minWidth: '120px',
                        py: 0,
                    },
                }}
                sx={{
                    // backgroundColor: palette.background.surface2,
                    '& .MuiMenu-paper': {
                        backgroundColor: '#2e2c56',
                        boxShadow: "3px 3px 2px #1e1d35"
                    },
                }}
            >

                {
                    account == replyInfo.sender ?
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
                        : <>...</>
                }
            </Menu>

        </Box>
    )

}