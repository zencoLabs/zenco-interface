import { useRootStore } from "@/src/store/root"; 
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useBuyPrices } from "@/src/hooks/bodhi/useBodhiData";
import { useGetSpaceFactoryUsers } from "@/src/hooks/bodhi/useGraphData";
import { BlogUser2 } from "../BlogUser2";
import { FormattedNumber } from "../../primitives/FormattedNumber";
import { SpaceFactoryUser } from "@/src/libs/model";
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble'; 
import { RevenuTooltip } from "../../infoTooltips/RevenuTooltip";
import { SharePriceTooltip } from "../../infoTooltips/SharePriceTooltip";
import { Row } from "../../primitives/Row";
import { isMobile } from 'react-device-detect';

export function SpaceList() {  
    const router = useRouter();
    const { currentTimestamp } = useRootStore()

    const [dataUserArray, setDataUserArray] = useState<SpaceFactoryUser[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 50;
    const loadedIds = useMemo(() => new Set(), []); 

    const { userArray, loading, error, refetch } = useGetSpaceFactoryUsers(currentPage, itemsPerPage); 

    useEffect(() => {
        refetch()
    }, [currentTimestamp, refetch]);

    useEffect(() => {
        if (userArray) {
            const newCreates = userArray.filter((user: SpaceFactoryUser) => !loadedIds.has(user.id));
            newCreates.forEach((user: SpaceFactoryUser) => loadedIds.add(user.id));
            setDataUserArray((prev) => [...prev, ...newCreates]); 
        }
    }, [userArray]);


    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        refetch();
    };

    return (
        <Box>
            {
                !isMobile ?
                    <Paper
                        sx={(theme) => ({

                            background: '#312f5c', 
                        })}
                    >

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 2,
                            mt: 4,
                            padding: '12px',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#3e3c76'
                            }
                        }}>
                            <Box>
                                {' '}
                            </Box>
                            <Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 6
                                }}>
                                    <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <Typography variant={'secondary16'} color={'text.secondary'}>
                                            REVENUE
                                        </Typography>
                                        <RevenuTooltip />
                                    </Box>
                                    <Box sx={{ width: '140px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <Typography variant={'secondary16'} color={'text.secondary'}>
                                            SHARE PRICE
                                        </Typography>
                                        <SharePriceTooltip />
                                    </Box>
                                </Box>

                            </Box>
                        </Box>


                        {dataUserArray?.map((space: any, index: number) => (
                            <Box key={index} sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 2,
                                mt: 4,
                                padding: '12px 8px',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#3e3c76'
                                }
                            }}
                                component={'div'}
                                onClick={() => {
                                    router.push(`/space-overview/?address=${space.user}`);
                                }}
                            >
                                <Box>
                                    <BlogUser2 sender={space.user} spaceUserInfo={space} imgWidth={36} showSpaceId={true} />
                                </Box>
                                <Box>
                                    <SpaceTrade userInfo={space} />
                                </Box>
                            </Box>
                        ))}

                    </Paper>
                    :
                    <>
                        {dataUserArray?.map((space: any, index: number) => (
                            <Paper
                                key={index}
                                sx={(theme) => ({
                                    padding: '12px',
                                    background: '#312f5c',
                                    mb: 3
                                })}
                            >
                                <Box key={index} sx={{
                                    display: 'flex',
                                    flexDirection: 'column', 
                                }}
                                    component={'div'}
                                    onClick={() => {
                                        router.push(`/space-overview/?address=${space.user}`);
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <BlogUser2 sender={space.user} spaceUserInfo={space} imgWidth={36} showSpaceId={false}
                                            MoreBox={
                                                <Typography variant={'main16'} color={'text.secondary'} sx={{
                                                    mr: 2,
                                                }}>
                                                    #{space?.spaceId}
                                                </Typography>
                                            } />
                                    </Box>
                                    <Box>
                                        <SpaceTradeMobile userInfo={space} />
                                    </Box>
                                </Box>
                            </Paper>
                        ))}

                    </>
            }


            {
                loading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress color="inherit" size={32} />
                    </Box>
                    :
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', mt: 4
                    }}>
                        {
                            userArray && userArray.length == itemsPerPage ?
                                <Button onClick={handleLoadMore} endIcon={
                                    <UnfoldMoreDoubleIcon className="icon-animation" />
                                }>Load More</Button>
                                :
                                <Typography variant={'secondary16'} color={'text.secondary'}>No more.</Typography>
                        }
                    </Box>

            }


        </Box>
    )
}


export function SpaceTrade({ userInfo }: {
    userInfo: SpaceFactoryUser
}) {

    const { ethPrice } = useRootStore()

    const buyPrices = useBuyPrices([{
        assetId: userInfo.descriptionAssetId ? Number(userInfo.descriptionAssetId) : -1,
        totalSupply: userInfo.spaceAsset?.totalSupply ?? 0
    }] ?? [])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            // justifyContent:'center',
            // alignItems:'center',
            gap: 6
        }}>
            <Box sx={{ width: '90px' }}>
                <FormattedNumber value={(userInfo.spaceAsset?.totalFees ?? 0) * (ethPrice ?? 0)} variant="main16" compact visibleDecimals={2} symbol="USD" />
            </Box>
            <Box sx={{ width: '140px' }}>
                <FormattedNumber
                    value={Number(buyPrices[0]?.data ?? 0) * (ethPrice ?? 0)}
                    variant="main16"
                    compact visibleDecimals={2}
                    symbol="USD" />
            </Box>
        </Box>
    )

}

export function SpaceTradeMobile({ userInfo }: {
    userInfo: SpaceFactoryUser
}) {



    const { ethPrice } = useRootStore()

    const buyPrices = useBuyPrices([{
        assetId: userInfo.descriptionAssetId ? Number(userInfo.descriptionAssetId) : -1,
        totalSupply: userInfo.spaceAsset?.totalSupply ?? 0
    }] ?? [])

    return (
        <Box>
            <Row
                caption={<>Revenue</>}
                align="flex-start"
                captionVariant="description"
                mt={2}
            >
                <FormattedNumber value={(userInfo.spaceAsset?.totalFees ?? 0) * (ethPrice ?? 0)} variant="main16" compact visibleDecimals={2} symbol="USD" />
            </Row>
            <Row
                caption={<>Share Price</>}
                align="flex-start"
                captionVariant="description"
                mt={2}
            >
                <FormattedNumber
                    value={Number(buyPrices[0]?.data ?? 0) * (ethPrice ?? 0)}
                    variant="main16"
                    compact visibleDecimals={2}
                    symbol="USD" />
            </Row>
        </Box>
    )


}