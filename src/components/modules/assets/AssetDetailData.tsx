import { Box, IconButton, Paper, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { AssetDetail } from './AssetDetail';
import { useRootStore } from '@/src/store/root';
import { gql, useQuery } from '@apollo/client';
import { useArweaveDatas } from '@/src/hooks/bodhi/useBodhiData';
import { useGetAssets, useGetUserSpaces } from '@/src/hooks/bodhi/useGraphData';
import { AssetToAccount } from './AssetToAccount';
import { AssetInfo } from '@/src/libs/model';
import { bodhi_ApolloClient } from '@/src/apollo/client';
import CachedIcon from '@mui/icons-material/Cached';

const GET_CREATES = gql`
  query GetCreates($assetId: Int!) {
   creates(where: {assetId: $assetId}) {
     id
     assetId
     arTxId
     sender
     blockTimestamp
     transactionHash
    }
  }
`;
  
export const AssetDetailData = ({ assetId }: {
    assetId: string
}) => {

    const [reload,setReload]=useState(0)
    const { currentTimestamp } = useRootStore() //refetch

    const { loading, error, data, refetch } = useQuery(GET_CREATES, {
        variables: { assetId: Number(assetId) },
        client: bodhi_ApolloClient,
        fetchPolicy: 'cache-first', // Use cache first 
    });
 
    const senders = data?.creates?.map((create: { sender: string }) => create.sender) || [];
    const { loading: assetLoading, error: assetError, data: assetData, refetch: AssetRefetch } = useGetAssets([Number(assetId)]); 
    const { loading: userSpaceLoading, error: userSpaceError, data: userSpaceData, refetch: UserSpaceRefetch } = useGetUserSpaces(senders);

    const arTxIds = data?.creates?.map((create: { arTxId: string }) => create.arTxId) || [];
    const arweaveQueries = useArweaveDatas(arTxIds)

    useEffect(() => {
        refetch()
        AssetRefetch() 
        UserSpaceRefetch()
    }, [currentTimestamp, refetch]);

    useEffect(() => {
        if (!data) {
            setTimeout(() => {
                refetch()
                AssetRefetch()
            }, 1000);
        }
    }, [data,reload]) 

    const assetInfo: AssetInfo | undefined = useMemo(() => {
        return assetData && assetData.assets.length > 0 ? assetData.assets[0] : undefined
    }, [assetData])
 
    return (
        <>
            {
                assetId  && arweaveQueries.length > 0 && data?.creates && assetData ?
                    <AssetDetail assetTempAssetModal={
                        {
                            id: data?.creates[0].id,
                            assetId: Number(assetId),
                            arTxId: data?.creates[0].arTxId,
                            sender: data?.creates[0].sender,
                            blockTimestamp: data?.creates[0].blockTimestamp,
                            transactionHash: data?.creates[0].transactionHash,
                            contentData: arweaveQueries[0]?.data,
                            spaceUserInfo: userSpaceData?.spaceFactories.find((g: { user: string; }) => g.user == senders[0]),
                            assetSupply: assetInfo?.totalSupply ?? 0,
                            // isDelete:assetInfo?.isDelete 
                        }
                    }
                        assetData={assetInfo} 
                    />
                    :
                <Paper
                    sx={(theme) => ({
                        padding: '12px',
                        background: '#312f5c',
                    })}
                >
                    {loading ? <>loading...</> :
                        <>
                            <AssetToAccount assetId={parseInt(assetId)} totalSupply={0}></AssetToAccount>
                            <Box sx={{
                                mt: 5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>

                                <IconButton
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        p: 0,
                                        minWidth: 0,
                                    }}
                                    onClick={() => { 
                                        setReload(Math.floor(Math.random() * 101))
                                    }}
                                >
                                    <CachedIcon />

                                </IconButton>
                                <Typography sx={{
                                }}>No data</Typography>

                            </Box>
                        </>
                    }
                </Paper>
            }
        </>
    )
}