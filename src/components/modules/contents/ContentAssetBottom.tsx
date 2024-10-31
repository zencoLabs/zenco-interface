import { Box, Button } from "@mui/material"
import { FormattedNumber } from "../../primitives/FormattedNumber"; 
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useQuery } from "@tanstack/react-query";
import { useRootStore } from "@/src/store/root";
import { ModalType, useModalStore } from "@/src/store/modalSlice";

export const ContentAssetBottom = ({ assetId,totalSupply }: {
    assetId: number;
    totalSupply: number
}) => {
    const { setType } = useModalStore()

    const { getBuyPrice, ethPrice } = useRootStore() 

    const { data: sharePrice, error } = useQuery({
        queryKey: ['getBuyPrice', assetId,totalSupply],
        queryFn: () => getBuyPrice(assetId, 1,totalSupply),
        refetchInterval: 60000,
    }) 

    return <>
        <Box sx={{
            mt: 3,
            pt: 1,
            borderTop: '1px solid #434b59',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Box>
                <Button variant="text" startIcon={<ChatBubbleOutlineIcon />} sx={{
                    padding: '2px 6px',
                    minWidth: '20px'
                }}>
                    <FormattedNumber
                        value={2}
                        variant={'secondary16'}
                        symbolsVariant={'secondary16'}
                        visibleDecimals={0}
                    />
                </Button>
            </Box>
            <Box sx={{
                display: 'flex',
                gap: 4,
            }}>
                <Button variant="text" startIcon={<CandlestickChartIcon />} sx={{
                    padding: '2px 6px',
                    minWidth: '20px'
                }}
                    onClick={() => { setType(ModalType.AssetBuy) }}
                >
                    <FormattedNumber
                        value={!error && sharePrice ? (sharePrice * (ethPrice ?? 0)) : 0}
                        symbol="USD"
                        variant={'secondary16'}
                        symbolsVariant={'secondary16'}
                        visibleDecimals={3}
                    />
                </Button>

                <Button variant="text" startIcon={<PermIdentityIcon />} sx={{
                    padding: '2px 6px',
                    minWidth: '20px'
                }}>
                    <FormattedNumber
                        value={2}
                        variant={'secondary16'}
                        symbolsVariant={'secondary16'}
                        visibleDecimals={0}
                    />
                </Button>

            </Box>
        </Box>
    </>
}