import { useGetTransactionInfo } from "@/src/hooks/bodhi/useBodhiData"
import { BlogContract, ConnectChainID } from "@/src/libs/chains"
import { EADDRESS } from "@/src/libs/tokens"
import { textCenterEllipsis } from "@/src/utils/text-center-ellipsis"
import { Avatar, Box, Typography } from "@mui/material"
import makeBlockie from "ethereum-blockies-base64"

export const AssetRecentTrade = ({
    trade
}: {
    trade: any
}) => { 

    const tradeType = trade.tradeType == 0 ? 'MINTED' :
        trade.tradeType == 1 ? 'BOUGHT' :
            trade.tradeType == 2 ? 'SOLD' : '' 

    let userAddress = EADDRESS
    if (trade.user.address == BlogContract[ConnectChainID].tradeHelper) {
        const transaction = useGetTransactionInfo(trade.transactionHash)

        if (transaction) userAddress = transaction.from.toLowerCase(); 

    } else {
        userAddress = trade.user.address
    }



    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center'
        }}>
            <Avatar sx={{ width: '24px', height: '24px' }} alt={''} src={makeBlockie(userAddress)} />
            <Typography>
                {textCenterEllipsis(userAddress, 5, 0)} {tradeType === 'MINTED' ? '(creator)' : ''}
            </Typography>
            <Typography variant={'main16'} sx={{
                backgroundColor: trade.tradeType==2?'#6e1313':'#335456',
                borderRadius: '2px',
                padding: '0px 3px'
            }}>
                {tradeType}
            </Typography>
            <Typography>
                {trade.tokenAmount} share {tradeType === 'MINTED' ? '' : `for ${trade.ethAmount} CFX`}
            </Typography> 
        </Box>
    )
}