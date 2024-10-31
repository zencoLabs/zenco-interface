import { Box, Typography } from "@mui/material" 
import { useRootStore } from "@/src/store/root"
import { FormattedNumber } from "../../primitives/FormattedNumber"
import { AssetValueTooltip } from "../../infoTooltips/AssetValueTooltip"

export const AssetOverview = ({
    asset
}: {
    asset: any
}) => {

    const { ethPrice } = useRootStore()

    return (
        <Box>

            <Box sx={{  display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 20px' }}> 
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <Typography variant={'main16'}>Share Supply</Typography>
                </Box>
                <FormattedNumber value={asset.totalSupply} variant="main16" symbol='Shares' />
            </Box>

            <Box sx={{ mt: 4,display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 20px' }}> 
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <Typography variant={'main16'}>Total Fees in the Pool</Typography>
                    <AssetValueTooltip />
                </Box>
                <FormattedNumber value={asset.totalFees * (ethPrice ?? 0)} variant="main16" symbol='USD' />
                <FormattedNumber value={asset.totalFees} variant="secondary14" color={'text.secondary'} compact visibleDecimals={4} symbol="CFX" />
            </Box>



            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 20px' }}> 
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <Typography variant={'main16'}>Total Trading Volume</Typography>
                </Box>
                <FormattedNumber value={asset.totalTradValue * (ethPrice ?? 0)} variant="main16" symbol='USD' />
                <FormattedNumber value={asset.totalTradValue} variant="secondary14" color={'text.secondary'} compact visibleDecimals={4} symbol="CFX" />
            </Box> 
        </Box>
    )
}