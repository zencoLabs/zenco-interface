import { Box, Paper } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { AssetInfo, CreateInfo } from '@/src/libs/model';
import { useGetAssetReplyCounts, useGetAssets, useGetUserSpaces } from '@/src/hooks/bodhi/useGraphData';
import { useRouter } from 'next/router';
import { useRootStore } from '@/src/store/root';
import { useArweaveDatas } from '@/src/hooks/bodhi/useBodhiData';
import { BlogUser2 } from '../BlogUser2';
import { useTempAssetStore } from '@/src/store/tempAssetSlice';
import ContentWithImage from '../contents/ContentWithImage';
import { ContentReplyCount } from '../contents/ContentReplyCount';
import { ContentAssetPrice } from '../contents/ContentAssetPrice';
import { ContentHolderCount } from '../contents/ContentHolderCount';
import { ContentMore } from '../contents/ContentMore';
import ContentWithImageMobile from '../contents/ContentWithImageMobile';
import { isMobile } from 'react-device-detect';

export const TrendItem = ({ create }: {
    create: CreateInfo
}) => {
    const { currentTimestamp } = useRootStore();
    const { setTempAssetModal } = useTempAssetStore()

    const router = useRouter();
    const { loading: assetLoading, error: assetError, data: assetData, refetch: AssetRefetch } = useGetAssets([Number(create.assetId)]);
    const { loading: assetReplyLoading, error: assetReplyError, data: assetReplyData, refetch: AssetReplyRefetch } = useGetAssetReplyCounts([Number(create.assetId)]);
    const { loading: userSpaceLoading, error: userSpaceError, data: userSpaceData, refetch: UserSpaceRefetch } = useGetUserSpaces([create.sender]);

    const arweaveQueries = useArweaveDatas([create.arTxId]); 
    const assetInfo: AssetInfo | undefined = useMemo(() => {
        return assetData && assetData.assets.length > 0 ? assetData.assets[0] : undefined
    }, [assetData])

    useEffect(() => {
        AssetRefetch();
        AssetReplyRefetch();
        UserSpaceRefetch();
    }, [currentTimestamp, AssetRefetch]);

    function _tempAssetData(create: any) {
        setTempAssetModal({
            id: create.id,
            assetId: create.assetId,
            arTxId: create.arTxId,
            sender: create.sender,
            blockTimestamp: create.blockTimestamp,
            transactionHash: create.transactionHash,
            contentData: arweaveQueries[0]?.data, 
            spaceUserInfo: userSpaceData?.spaceFactories.find((g: { user: string; }) => g.user == create.sender),
            assetSupply: assetInfo?.totalSupply ?? 0
        })
    }



    return (
        <>
            {
                assetInfo && assetInfo.isDelete == false ?

                    <Paper
                        sx={(theme) => ({
                            padding: '12px',
                            background: '#312f5c',
                        })}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <>
                                {
                                    userSpaceData && (
                                        <BlogUser2 blockTimestamp={create.blockTimestamp} sender={create.sender} key={create.sender}
                                            spaceUserInfo={userSpaceData?.spaceFactories.find((g: { user: string; }) => g.user == create.sender)}
                                            handleClick={() => {
                                                router.push(`/space-overview/?address=${create.sender}`);
                                            }}
                                            MoreBox={
                                                <>
                                                    <ContentMore assetId={create.assetId} assetData={assetInfo} />
                                                </>
                                            }
                                        />
                                    )
                                }
                            </>

                        </Box>

                        <Box sx={{
                            mt: 3,
                            color: '#d7e2e3', 
                        }}
                            component={'div'} 
                            onClick={() => {
                                _tempAssetData(create)
                                router.push(`/asset-overview/?assetid=${create.assetId}`);
                            }}
                        >

                            <>
                                {
                                    arweaveQueries[0]?.data && ( 
                                        <>
                                            {
                                                !isMobile ? <ContentWithImage content={arweaveQueries[0]?.data} /> :
                                                    <ContentWithImageMobile content={arweaveQueries[0]?.data} />
                                            }
                                        </>

                                    )
                                }
                            </>

                        </Box>


                        <Box sx={{
                            mt: 3,
                            pt: 1,
                            borderTop: '1px solid #434b59',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Box>
                                {
                                    !assetReplyError && (
                                        <ContentReplyCount replyCount={assetReplyData?.spaceCounts.find((g: any) => g.parentId == create.assetId)?.count}
                                            handleClick={() => {
                                                _tempAssetData(create)
                                                router.push(`/asset-overview/?assetid=${create.assetId}&reply=1`);
                                            }} />
                                    )
                                }

                            </Box>
                            <Box sx={{
                                display: 'flex',
                                gap: 4,
                            }}>

                                <ContentAssetPrice assetId={create.assetId} totalSupply={assetInfo.totalSupply ?? 0} handleClick={() => { _tempAssetData(create) }} />
                                <ContentHolderCount assetId={create.assetId}
                                    holdersCount={assetInfo.totalHolders ?? 0}
                                    handleClick={() => { _tempAssetData(create) }} />
                            </Box>
                        </Box>

                    </Paper>

                    : <></>
            }

        </>
    )
}