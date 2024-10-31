import { Avatar, Box, Typography } from "@mui/material" 
import { useRouter } from "next/router";
import { formatTimestamp, textCenterEllipsis } from "@/src/utils/text-center-ellipsis";
import { TradeLog } from "@/src/libs/model";
import makeBlockie from "ethereum-blockies-base64";
import { ethers } from "ethers"; 
import { useUpdateTradeLog } from "@/src/hooks/bodhi/useMongoData";

export const MessageDetail = ({
    log
}: { log: TradeLog }) => {
    const mutation = useUpdateTradeLog();

    const tradeTypes = ["minted", "bought", "sold", "removed", "replied"];
    const _tradeType = tradeTypes[log.tradeType]
    const _bgColor = _tradeType == 'sold' ? '#6d4949' : _tradeType == 'replied' ? '#1677af' : '#335456'

    const router = useRouter();

    function handleClick() {
        mutation.mutate(log._id);
        router.push(`asset-overview?assetid=${_tradeType == 'replied' ? log.parentAssetId : log.assetId}`);
    }

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
            position: 'relative',
            '&:hover': {
                backgroundColor: '#38366a',
            }
        }}
            component={'div'}
            onClick={() => {
                handleClick()
            }}
        > 

            <Avatar sx={{ width: '24px', height: '24px' }} alt={''} src={makeBlockie(log.from)} />
            <Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    mt: 2,
                }}>
                    {
                        _tradeType == "minted" && (
                            <>
                                <Typography variant={"secondary16"} color={'text.secondary'}>
                                    You
                                </Typography>
                                <Typography variant={'main16'} sx={{
                                    backgroundColor: _bgColor,
                                    borderRadius: '2px',
                                    padding: '0px 3px',
                                }}>
                                    created
                                </Typography>
                                <Typography variant={"secondary16"} color={'text.secondary'}>
                                    your own space.
                                </Typography>
                            </>
                        )
                    }

                    {
                        _tradeType == "replied" && (
                            <>
                                <Typography variant={"secondary16"} color={'text.secondary'}>
                                    {textCenterEllipsis(log.from, 5, 0)}
                                </Typography>
                                <Typography variant={'main16'} sx={{
                                    backgroundColor: _bgColor,
                                    borderRadius: '2px',
                                    padding: '0px 3px',
                                }}>
                                    {_tradeType.toUpperCase()}
                                </Typography>
                                <Typography variant={"secondary16"} color={'text.secondary'}>
                                    you at #{log.parentAssetId}
                                </Typography>

                            </>
                        )
                    }

                    {
                        (_tradeType == "bought" || _tradeType == "sold" || _tradeType == "removed") && (
                            <>
                                <Typography variant={"secondary16"} color={'text.secondary'}>
                                    {textCenterEllipsis(log.from, 5, 0)}
                                </Typography>
                                <Typography variant={'main16'} sx={{
                                    backgroundColor: _bgColor,
                                    borderRadius: '2px',
                                    padding: '0px 3px',
                                }}>
                                    {_tradeType.toUpperCase()}
                                </Typography>
                                <Typography variant={"secondary16"} color={'text.secondary'}>
                                    {ethers.utils.formatUnits(log.tokenAmount, 18)} share of your asset #{log.assetId}
                                </Typography>

                            </>
                        )
                    }

                </Box>
                <Typography variant={'secondary14'} color={'text.secondary'} sx={{
                    mt: 2
                }}>{formatTimestamp(log.timestamp)}</Typography>
            </Box> 
        </Box>
    )
}