import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import { ContentAssetPrice } from '@/src/components/modules/contents/ContentAssetPrice';
import { ContentHolderCount } from '@/src/components/modules/contents/ContentHolderCount';
import { ContentReply } from '@/src/components/modules/contents/ContentReply';
import { TempAssetModal, useTempAssetStore } from '@/src/store/tempAssetSlice';
import { AssetToAccount } from './AssetToAccount';
import { BlogUser2 } from '../BlogUser2';
import { AssetDetailOverview } from './AssetDetailOverview';
import { useRouter } from 'next/router';
import { ContentMore } from '../contents/ContentMore';
import { AssetInfo } from '@/src/libs/model';

export const AssetDetail = ({ assetTempAssetModal, assetData }: {
    assetTempAssetModal: TempAssetModal, 
    assetData?: AssetInfo
}) => {
    const router = useRouter();
    const { setTempAssetModal } = useTempAssetStore();

    return (
        <>
            <AssetToAccount assetId={assetTempAssetModal?.assetId} totalSupply={assetData?.totalSupply??0} goback={'/'} />

            {
                !assetData?.isDelete ?
                    <>
                        <Paper
                            sx={(theme) => ({
                                padding: '12px',
                                background: '#312f5c', 
                                mt: 3
                            })}
                        >
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <>
                                    {
                                        assetTempAssetModal.spaceUserInfo && (
                                            <BlogUser2 blockTimestamp={assetTempAssetModal.blockTimestamp} sender={assetTempAssetModal.sender}
                                                spaceUserInfo={assetTempAssetModal.spaceUserInfo}
                                                handleClick={() => {
                                                    router.push(`/space-overview/?address=${assetTempAssetModal.sender}`);
                                                }}
                                                MoreBox={
                                                    <>
                                                        {
                                                            assetData && (
                                                                <ContentMore assetId={assetTempAssetModal.assetId} assetData={assetData} />
                                                            )
                                                        }

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
                                // lineHeight: '24px',
                                // fontSize: '15px'
                            }}
                                component={'div'}
                            > 

                                <div className="ql-editor bodhi-editor-detail" dangerouslySetInnerHTML={{ __html: assetTempAssetModal?.contentData ?? '' }} />
                             
                            </Box>

                            <Box sx={{
                                mt: 3,
                                pt: 1,
                                borderTop: '1px solid #434b59',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>

                                <Box sx={{
                                    display: 'flex',
                                    gap: 4,
                                    alignItems: 'start',
                                    justifyContent: 'space-between',
                                    flex: 1
                                }}>

                                    <ContentAssetPrice
                                        assetId={assetTempAssetModal?.assetId!}
                                        totalSupply={assetData?.totalSupply??0}
                                        showUnit={true}
                                        handleClick={() => { setTempAssetModal(assetTempAssetModal) }} />

                                    <ContentHolderCount assetId={assetTempAssetModal?.assetId} holdersCount={
                                        assetData?.totalHolders ?? 0
                                    } />

                                </Box>
                            </Box>

                            <Box>
                                <ContentReply assetTempAssetModal={assetTempAssetModal} />
                            </Box>
                        </Paper>

                        <AssetDetailOverview assetId={assetTempAssetModal?.assetId} />
                    </>
                    : <>
                        <Paper
                            sx={(theme) => ({
                                padding: '12px',
                                background: '#312f5c', 
                                mt: 3
                            })}
                        >
                            <Typography variant={'secondary16'} color={'text.secondary'}>
                                Hmm...this page doesn’t exist.
                            </Typography>
                        </Paper>
                    </>
            }

        </>
    )
}