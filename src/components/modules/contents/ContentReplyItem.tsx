import { Box, Typography } from '@mui/material'
import React from 'react'
import { useArweaveDatas } from '@/src/hooks/bodhi/useBodhiData';
import { BlogUser2 } from '../BlogUser2';
import { SpaceReply } from '@/src/libs/model';
import { useRouter } from 'next/router';
import { ContentReplyMore } from './ContentReplyMore';

export const ContentReplyItem = ({ replyInfo }: {
    replyInfo: SpaceReply
}) => {
    const router = useRouter(); 
    const arTxIds = replyInfo ? [replyInfo.arTxId] : []
    const arweaveQueries = useArweaveDatas(arTxIds) 

    return (
        <>
            {
                arweaveQueries.length > 0 ?

                    <>
                        <Box sx={{
                            mb: 2,
                            borderTop: '1px solid #434b59',
                            padding: '10px 0'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <BlogUser2 blockTimestamp={replyInfo.blockTimestamp}
                                    sender={replyInfo.sender}
                                    spaceUserInfo={replyInfo?.spaceFactory}
                                    imgWidth={28}
                                    handleClick={() => {
                                        router.push(`/space-overview/?address=${replyInfo.sender}`);
                                    }}
                                    MoreBox={
                                        <>
                                        {
                                             !replyInfo.isDelete?<ContentReplyMore replyInfo={replyInfo} />:<></>
                                        }
                                            
                                        </>
                                    }
                                />
                            </Box>
                            <Box sx={{
                                mt: 2,
                                pl: 8,
                                color: '#d7e2e3',
                            }}
                                component={'div'}
                            >
                                {
                                    replyInfo.isDelete?
                                    <Typography color={'text.secondary'} sx={{
                                        background:'#292848',
                                        borderRadius:'4px',
                                        padding:'2px 6px'
                                    }}>
                                        <em>Removed</em>
                                    </Typography>
                                    :
                                    <div dangerouslySetInnerHTML={{ __html: arweaveQueries[0]?.data?.replace(/\n/g, '<br />') ?? '' }} />
                                }
                                
                            </Box>
                        </Box>
                    </>
                    :
                    <></>
            }

        </>
    )
}