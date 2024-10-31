import { Box, Button, Typography } from "@mui/material"
import { FormattedNumber } from "../../primitives/FormattedNumber";
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'; 
import { useRootStore } from "@/src/store/root";
import { ModalType, useModalStore } from "@/src/store/modalSlice";
import { useBuyPrice } from "@/src/hooks/bodhi/useBodhiData";

export const ContentAssetPrice = ({
    totalSupply,
    assetId,
    handleClick,
    showUnit
}: {
    totalSupply: number,
    assetId: number,
    handleClick?: () => void,
    showUnit?: boolean,
}) => {
    const { setType } = useModalStore()
    const { account, ethPrice, setWalletModalOpen } = useRootStore()

    const { data: sharePrice, error } = useBuyPrice(assetId, totalSupply) 

    async function handleCreate() {
        if (!account) {
            setWalletModalOpen(true)
        } else {
            setType(ModalType.AssetBuy)
            handleClick && handleClick()
        }
    }

    return <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
        <Button variant="text" startIcon={<CandlestickChartIcon />} sx={{
            padding: '2px 0px',
            minWidth: '20px'
        }}
            onClick={() => {
                handleCreate()
            }}
        >
            <FormattedNumber
                value={!error && sharePrice ? (sharePrice * (ethPrice ?? 0)) : 0}
                symbol="USD"
                variant={'secondary16'}
                symbolsVariant={'secondary16'}
                visibleDecimals={3}
            />
        </Button>

        {
            showUnit && (
                <Typography color={'text.secondary'} sx={{ ml: 4 }} component={'div'}
                    onClick={() => {
                        handleCreate()
                    }}
                >
                    <FormattedNumber value={sharePrice ?? 0} variant="secondary14" compact visibleDecimals={3} symbol="CFX/Share" />
                </Typography>
            )
        }

    </Box>
}