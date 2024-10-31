import { Avatar, AvatarGroup, Box, Button, IconButton, SvgIcon, Typography } from "@mui/material";
import Link from "next/link"; 
import { SpaceOverviewUserDescription } from "./SpaceOverviewUserDescription"; 
import { useRootStore } from "@/src/store/root"; 
import { BlogUser2 } from "../BlogUser2";
import { FormattedNumber } from "../../primitives/FormattedNumber";
import { SpaceFactoryUser } from "@/src/libs/model";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { grey } from "@mui/material/colors";
import { useGetAssetHolders, useGetUserSpaces } from "@/src/hooks/bodhi/useGraphData";
import { useEffect } from "react";
import { UserAvatar } from "../UserAvatar";
import { useTempAssetStore } from "@/src/store/tempAssetSlice";
import { ModalType, useModalStore } from "@/src/store/modalSlice";
import { TxModalDetails } from "../../FlowCommons/TxModalDetails"; 
import { useBuyPrice } from "@/src/hooks/bodhi/useBodhiData"; 
import { AssetToAccount } from "../assets/AssetToAccount";

export const SpaceOverviewUser = ({
    spaceUser
}: {
    spaceUser?: SpaceFactoryUser;
}) => { 
    const { setTempSpaceModal } = useTempAssetStore();
    const { setType } = useModalStore()
    const { ethPrice, currentTimestamp, account, setWalletModalOpen } = useRootStore()
    const { userArray, error, refetch } = useGetAssetHolders(Number(spaceUser?.descriptionAssetId), 4)
    const { loading: userSpaceLoading, error: userSpaceError, data: userSpaceData } = useGetUserSpaces(userArray ?? [''])

    const { data: sharePrice } = useBuyPrice(Number(spaceUser?.descriptionAssetId), Number(spaceUser?.spaceAsset?.totalSupply))

    useEffect(() => {
        refetch()
    }, [currentTimestamp, refetch]) 

    function handlSpaceTrancation(type: number) {
        if (!account) {
            setWalletModalOpen(true)
        } else {
            setTempSpaceModal({
                assetId: Number(spaceUser?.descriptionAssetId),
                assetSupply: spaceUser?.spaceAsset?.totalSupply ?? 0,
                spaceId: Number(spaceUser?.spaceId),
                spaceAddress: spaceUser?.spaceAddress,
                spaceCreator: spaceUser?.user,
                totalFees: spaceUser?.spaceAsset?.totalFees,
                totalTradValue: spaceUser?.spaceAsset?.totalTradValue,
            })
            if (type == 1) {
                setType(ModalType.SpaceBuy)
            } else if (type == 2) {
                setType(ModalType.SpaceSell)
            }
            else if (type == 3) {
                setType(ModalType.SpaceDistribution)
            } else {
                setType(ModalType.SpaceInfo)
            }
        }
    }

    return (
        <Box>
            {
                (spaceUser) && (
                    <> 
                        <AssetToAccount assetId={Number(spaceUser?.descriptionAssetId)} totalSupply={spaceUser?.spaceAsset?.totalSupply ?? 0} goback={'/space'}
                            child={
                                <Typography>
                                    Space #{spaceUser.spaceId}
                                </Typography>
                            }
                        />

                        <Box sx={{ mt: 3 }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <BlogUser2 sender={spaceUser.user!} spaceUserInfo={spaceUser}
                                    MoreBox={ 
                                        <>
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
                                                    handlSpaceTrancation(4)
                                                }}
                                            >
                                                <SvgIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: 'text.muted',
                                                        borderRadius: '50%',
                                                        '&:hover': { color: 'info.main' },
                                                    }}
                                                > 
                                                    <MoreHorizIcon fontSize="medium" sx={{
                                                        color: '#d7e2e3',
                                                    }} />
                                                </SvgIcon>
                                            </IconButton>
                                        </>
                                    }
                                />
                            </Box>
 
                            {
                                spaceUser.descriptionAssetId ?
                                    <Box sx={{
                                        paddingLeft: '48px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px'
                                    }}> 
                                        <SpaceOverviewUserDescription assetId={Number(spaceUser.descriptionAssetId)} />
                                    </Box>
                                    : <></>
                            }


                        </Box>

                        {/* <Divider sx={{ mt: 1, mb: 2 }} /> */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <AvatarGroup
                                // renderSurplus={(surplus) => <span>+{surplus.toString()[0]}k</span>}
                                // total={4251}
                                >
                                    {
                                        userSpaceData && (
                                            <>
                                                {userArray?.map((address: string) => (
                                                    <>
                                                        {
                                                            userSpaceData.spaceFactories.filter((g: any) => g.user == address).length == 0 && (
                                                                <UserAvatar sender={address} imgWidth={32} />
                                                            )
                                                        }
                                                    </>
                                                ))}

                                                {userSpaceData.spaceFactories.map((create: any) => (
                                                    <UserAvatar sender={create.user} spaceUserInfo={create} imgWidth={32} />
                                                ))}


                                            </>
                                        )
                                    }


                                    <Avatar sx={{ bgcolor: grey[500], width: 32, height: 32 }}>
                                        <Link href={`/asset-overview?assetid=${spaceUser?.descriptionAssetId}`}>   <MoreHorizIcon /> </Link>
                                    </Avatar>

                                </AvatarGroup>

                                <Link href={`/asset-overview?assetid=${spaceUser?.descriptionAssetId}`}>
                                    <FormattedNumber
                                        value={spaceUser.spaceAsset?.totalHolders ?? 0}
                                        symbol="holders"
                                        variant={'secondary16'}
                                        symbolsVariant={'secondary16'}
                                        color={'text.primary'}
                                        symbolsColor={'text.secondary'}
                                        visibleDecimals={0}
                                    />
                                </Link>

                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Button
                                    //variant={!replyContent ? 'contained' : 'surface'}
                                    onClick={() => { handlSpaceTrancation(1) }}
                                    variant={'surface'}
                                    sx={{ minWidth: '60px', padding: '4px' }}
                                    startIcon={<></>}
                                >
                                    Buy
                                </Button>
                                <Button
                                    onClick={() => { handlSpaceTrancation(2) }}
                                    variant={'contained'}
                                    sx={{ minWidth: '60px', padding: '4px' }}
                                >
                                    Sell
                                </Button>
                            </Box>

                        </Box>

                        <TxModalDetails title="Overview">

                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: '140px auto auto',
                                gridTemplateRows: 'repeat(4, auto)',
                                gap: '10px'
                            }}>
                                <Typography color={'text.secondary'}>Revenue</Typography>
                                <Box><FormattedNumber value={spaceUser.spaceAsset?.totalFees ?? 0 * (ethPrice ?? 0)} symbol="USD" variant={'main16'} compact visibleDecimals={3} /></Box>
                                <Box>
                                    <Button
                                        onClick={() => { handlSpaceTrancation(3) }}
                                        variant={'surface_2'}
                                        sx={{ minWidth: '60px', padding: '2px 6px' }}
                                    >
                                        Distribution
                                    </Button>
                                </Box>

                                <Typography color={'text.secondary'}>Price</Typography>
                                <Box><FormattedNumber value={sharePrice ?? 0} variant={'main16'} symbolsVariant={"secondary14"} compact visibleDecimals={3} symbol="CFX/Share" /></Box>
                                <Box></Box>

                                <Typography color={'text.secondary'}>Transactions</Typography>
                                <Box><FormattedNumber value={(Number(spaceUser.spaceAsset?.totalTrades) - 1) ?? 0} variant={'main16'} compact visibleDecimals={0} /></Box>
                                <Box></Box>

                                <Typography color={'text.secondary'}>Transaction Value </Typography>
                                <Box><FormattedNumber value={spaceUser.spaceAsset?.totalTradValue ?? 0} variant={'main16'} symbolsVariant={"secondary14"} compact visibleDecimals={4} symbol="CFX" /></Box>
                                <Box></Box>
                            </Box>


                        </TxModalDetails>


                    </>
                )
            }

        </Box>
    )
}