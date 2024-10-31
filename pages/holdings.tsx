import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { Box, Typography } from '@mui/material';
import useUserAssetInfo from '@/src/hooks/useUserAssetInfo';
import { FormattedNumber } from '@/src/components/primitives/FormattedNumber';
import { useRootStore } from '@/src/store/root';  
import { HoldingDetail } from '@/src/components/modules/holdings/HoldingDetail';
import { EADDRESS } from '@/src/libs/tokens';

export default function Holdings() { 

    const { account, ethPrice } = useRootStore()
    const { loading, userAssets, totalAmountETH, totalFees } = useUserAssetInfo(account ?? EADDRESS)

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
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant={"secondary16"} color={'text.secondary'}>
                            Total: {userAssets.length} Assets 
                        </Typography>
                       
                        <Box sx={{ mt: 2 }}>
                            <FormattedNumber
                                value={Number(totalAmountETH) * (ethPrice ?? 0)}
                                variant={'main21'}
                                symbolsVariant={'main21'}
                                color={'text.primary'}
                                symbolsColor={'text.primary'}
                                visibleDecimals={4}
                                symbol="USD"
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <FormattedNumber
                                value={totalAmountETH}
                                variant={'secondary16'}
                                symbolsVariant={'secondary16'}
                                color={'text.secondary'}
                                symbolsColor={'text.secondary'}
                                visibleDecimals={4}
                                symbol="CFX"
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1
                        }}>
                            <Typography variant={"secondary16"} color={'text.primary'}>Creator Fee Received:</Typography>
                            <FormattedNumber
                                value={Number(totalFees) * (ethPrice ?? 0)}
                                variant={'secondary16'}
                                symbolsVariant={'secondary16'}
                                color={'text.primary'}
                                symbolsColor={'text.primary'}
                                visibleDecimals={4}
                                symbol="USD"
                            /> 
                        </Box>

                    </Box>

                    {
                        loading ?
                            <p>Loading...</p>
                            :
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {
                                    (userAssets as any[]).map((item: any, index: number) => (
                                        <HoldingDetail key={index} item={item} ethPrice={ethPrice} />
                                    ))
                                }
                            </Box>
                    }

                </Box>
            </MainLayout>

        </>
    )
}
