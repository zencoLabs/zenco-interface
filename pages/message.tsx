import { Box, Typography } from '@mui/material'
import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { useRootStore } from '@/src/store/root'
import { useTradelogs } from '@/src/hooks/bodhi/useMongoData'
import { MessageDetail } from '@/src/components/modules/messages/MessageDetail'
import { MessageDetailMobile } from '@/src/components/modules/messages/MessageDetailMobile'
import { isMobile } from 'react-device-detect';

export default function Message() { 

    const { account } = useRootStore() //refetch

    const { tradelogs, error } = useTradelogs(account?.toLowerCase()); 

    return (
        <>

            <MainLayout>
                <Box sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    gap: 4,

                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography variant={'main16'}>New Message</Typography>
                    </Box>

                    {
                        !tradelogs ? <div>Loading...</div> :
                            <>
                                {tradelogs.length > 0 ? (
                                    <Box>
                                        {
                                            !isMobile ?
                                                <> {tradelogs.map((log) => (
                                                    <MessageDetail log={log} key={log._id} />
                                                ))}</>
                                                : <>
                                                    {tradelogs.map((log) => (
                                                        <MessageDetailMobile log={log} key={log._id} />
                                                    ))}
                                                </>
                                        }
                                    </Box>
                                ) : (
                                    <p>No trade logs found</p>
                                )}
                            </>

                    }


                </Box>
            </MainLayout>


        </>
    )
}
