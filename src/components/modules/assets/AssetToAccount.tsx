import { Box, Typography } from "@mui/material" 
import { useRootStore } from "@/src/store/root"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import { useRouter } from "next/router";
import { FormattedNumber } from "../../primitives/FormattedNumber";
import { useBalanceByAccount_Asset, useSellPrice } from "@/src/hooks/bodhi/useBodhiData";
import { ReactNode } from "react";

export const AssetToAccount = ({
    assetId,
    totalSupply, 
    child
}: {
    assetId: number,
    totalSupply: number,
    goback?: string;
    child?: ReactNode
}) => {
    const router = useRouter(); 
    const { account, ethPrice, currentTimestamp } = useRootStore()

    const { data: sharePrice, error: shareError } = useSellPrice(assetId, totalSupply, currentTimestamp ?? 0)
    const { data: shareAmount, error: amountError } = useBalanceByAccount_Asset(account ?? '', assetId, currentTimestamp ?? 0)
    const handleBackClick = () => {
        if (document.referrer) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#4b4984',
            border: '1px solid #4b4984',
            borderRadius: 1,
            padding: '10px',
            gap: 2
        }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Link href="#" onClick={handleBackClick}>
                    <ArrowBackIcon sx={{ color: '#F9FFFE' }} />
                </Link>
                {child && (
                    <>
                        {child}
                    </>
                )}
            </Box>
            {
                account ?
                    <>
                        {
                            !shareError && !amountError && sharePrice && shareAmount ?
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'end',
                                    alignItems: 'flex-end',
                                    mt: 2,
                                    gap: 2
                                }}> 
                                    <FormattedNumber value={sharePrice * shareAmount * (ethPrice ?? 0)} variant="main21" compact visibleDecimals={3} symbol="USD" />

                                    <Typography>
                                        My Shares:{' '}{shareAmount} {' '}
                                        (≈ <FormattedNumber value={sharePrice * shareAmount} compact visibleDecimals={2} symbol="CFX" />)
                                    </Typography>
                                </Box>
                                :
                                <></>
                        }
                    </>
                    : <></>
            }

        </Box>
    )
}