import { ModalType, useModalStore } from "@/src/store/modalSlice"
import { Alert, Box, Divider, IconButton, Typography } from "@mui/material"; 
import { useTempAssetStore } from "@/src/store/tempAssetSlice";
import { BasicModal } from "../../primitives/BasicModal";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toastInfo } from "@/src/libs/toastAlert";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from "next/link";
import { CHAINS, ConnectChainID } from "@/src/libs/chains";

export const SpaceDetailModal = () => {
    const { type, close } = useModalStore();
    const { tempSpaceModal } = useTempAssetStore();


    async function closeDailog() {
        close()
    }
    return <>
        <BasicModal open={type === ModalType.SpaceInfo} setOpen={closeDailog} contentMaxWidth={480}>
            <Typography variant="h2" sx={{ mb: 4 }}>
                Space #{tempSpaceModal?.spaceId} Details
            </Typography>


            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,mt:8 }}>
                <Typography variant={'main14'} sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <>SPACE ADDRESS</>
                    <IconButton
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            p: 0,
                            minWidth: 0,
                        }}
                        onClick={() => {
                            navigator.clipboard.writeText(`${tempSpaceModal?.spaceAddress}`);
                            toastInfo(true, 'Copy successful.')
                        }}
                    >
                        <ContentCopyIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                </Typography>
                <Typography variant={'secondary16'} color={'text.secondary'}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <>{tempSpaceModal?.spaceAddress}</>
                    <Link target="_blank" href={`${CHAINS[ConnectChainID].blockExplorerUrls![0]}/address/${tempSpaceModal?.spaceAddress}`}>
                        <IconButton
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                p: 0,
                                minWidth: 0,
                            }}
                        >
                            <OpenInNewIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                    </Link>
                </Typography>

                <Divider sx={{ mt: 0, mb: 2 }} />
                <Typography variant={'main14'} sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <>CREATOR</>
                    <IconButton
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            p: 0,
                            minWidth: 0,
                        }}
                        onClick={() => {
                            navigator.clipboard.writeText(`${tempSpaceModal?.spaceCreator}`);
                            toastInfo(true, 'Copy successful.')
                        }}
                    >
                        <ContentCopyIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                </Typography>
                <Typography variant={'secondary16'} color={'text.secondary'}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <>{tempSpaceModal?.spaceCreator}</>
                    <Link target="_blank" href={`${CHAINS[ConnectChainID].blockExplorerUrls![0]}/address/${tempSpaceModal?.spaceCreator}`}>
                        <IconButton
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                p: 0,
                                minWidth: 0,
                            }}
                        >
                            <OpenInNewIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                    </Link>
                </Typography>


                <Divider sx={{ mt: 0, mb: 2 }} />
                <Typography variant={'main14'} sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    SPACE ASSET
                </Typography>
                <Typography variant={'secondary16'} color={'text.secondary'}>
                    #{tempSpaceModal?.assetId}
                </Typography>

                <Alert severity="info" sx={{ mt: '24px', mb: '6px'}}>
                    <>Space revenue will be shared among holders of this asset.</><br/>
                    <Link href={`/asset-overview?assetid=${tempSpaceModal?.assetId}`} onClick={()=>closeDailog()}>View in asset page</Link>
                </Alert>

            </Box>


        </BasicModal>
    </>
}