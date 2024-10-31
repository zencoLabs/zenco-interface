import { Box, Typography } from "@mui/material" 
import { useRouter } from "next/router"; 
import { FormattedNumber } from "../../primitives/FormattedNumber";

export const HoldingDetail = ({
    item,
    ethPrice
}: {
    item: any,
    ethPrice?: number;
}) => {
    const router = useRouter(); 

    return (
        <Box sx={{
            backgroundColor: '#312f5c',
            mt: 3,
            borderRadius: 2,
            padding: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            '&:hover':{
                backgroundColor: '#38366a',
            }
        }}
            component={'div'}
            onClick={() => {
                router.push(`/asset-overview/?assetid=${item.assetId}`);
            }}
        >
            <Box sx={{
                backgroundColor: '#75cedb',
                minWidth: '90px',
                minHeight: '90px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                borderRadius: '4px'
            }}> 
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"></path><path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"></path></svg>
                <span>Txt</span>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                flex: 1
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Typography variant={"secondary16"} color={'text.secondary'}>
                        #{item.assetId}
                    </Typography>

                    {
                        (item.userAddress === item.creatorAddress) && (
                            <Typography variant={"secondary16"} color={'#36df66'}>
                                owner
                            </Typography>
                        )
                    }


                </Box>
                <Typography variant={"secondary16"} color={'text.secondary'}>
                    <FormattedNumber
                        value={item.amount}
                        variant={'secondary16'}
                        symbolsVariant={'secondary16'}
                        color={'text.secondary'}
                        symbolsColor={'text.secondary'}
                        visibleDecimals={2}
                        symbol="Shares"
                    />
                    {' '}
                    ( ≈ <FormattedNumber
                        value={Number(item.amount) * Number(item.amountETH)}
                        variant={'secondary16'}
                        symbolsVariant={'secondary16'}
                        color={'text.secondary'}
                        symbolsColor={'text.secondary'}
                        visibleDecimals={4}
                        symbol="CFX"
                    />)
                </Typography>
                <Typography sx={{ mt: 0 }}>
                    <FormattedNumber
                        value={Number(item.amount) * Number(item.amountETH) * (ethPrice ?? 0)}
                        variant={'main21'}
                        symbolsVariant={'main21'}
                        color={'text.primary'}
                        symbolsColor={'text.primary'}
                        visibleDecimals={4}
                        symbol="USD"
                    />
                </Typography>
            </Box>
        </Box>
    )
}