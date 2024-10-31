import { Box, Button, CircularProgress, InputAdornment, InputBase, Typography } from "@mui/material"
import { TxModalDetails } from "../FlowCommons/TxModalDetails"
import { FormattedNumber } from "../primitives/FormattedNumber"
import { PriceTooltip } from "../infoTooltips/PriceTooltip"
import { Row } from "../primitives/Row"
import { NumberFormatCustom } from "../FlowCommons/AssetInput"
import { useEffect, useState } from "react"
import { useRootStore } from "@/src/store/root"
import { BlogContract, ConnectChainID } from "@/src/libs/chains"
import { Contract, ethers } from "ethers"
import bodhiTradeHelperABI from '@/src/abis/bodhiTradeHelper.json';
import { toastInfo } from "@/src/libs/toastAlert"
import { useModalStore } from "@/src/store/modalSlice"
import { useBackgroundDataProvider } from "@/src/hooks/BackgroundDataProvider"
  
export const SpaceBuyContent = ({
    assetId,
    totalSupply
}: {
    assetId: number;
    totalSupply: number;
}) => {
    const { close } = useModalStore();
    const { account, signer, getBuyPriceAfterFee, ethPrice } = useRootStore()
    const [buyValue, setBuyValue] = useState(0);
    const [buyPriceETH, setBuyPriceETH] = useState(0);
    const [loading, setLoading] = useState(false);

    const { refetchBodhiData } = useBackgroundDataProvider() 

    useEffect(() => {
        if (buyValue && buyValue !== 0) {
            _getBuyPriceAfterFee()
        } else {
            setBuyPriceETH(0)
        }
    }, [buyValue])

    async function _getBuyPriceAfterFee() {
        const price = await getBuyPriceAfterFee(assetId, buyValue, totalSupply)
        setBuyPriceETH(price ?? 0)
    }

    async function handleClick() {
        if (buyPriceETH == 0 || buyValue == 0) return;

        setLoading(true)
        try {

            const tradeHelperStr = BlogContract[ConnectChainID].tradeHelper
            const bodhiTradeHelperContract = new Contract(tradeHelperStr, bodhiTradeHelperABI, signer) //  

            const buyPriceETHWEI = ethers.utils.parseEther(buyPriceETH.toString());
            const amountInWei = ethers.utils.parseUnits(buyValue.toString(), 18); 

            const txObject = {
                from: account,
                to: tradeHelperStr, //  
                value: buyPriceETHWEI,//BigNumber.from(0),
                data: bodhiTradeHelperContract.interface.encodeFunctionData('safeBuy', [assetId, amountInWei]), //  
            };
            const gasLimit = await bodhiTradeHelperContract.provider.estimateGas(txObject)  
            const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

            sendPromise?.then((txResponse) => { 

                //
                txResponse.wait().then((receipt) => { 
                    if (receipt.status === 1) { 
                        toastInfo(true, 'Confirm Success.') 
                        refetchBodhiData && refetchBodhiData()

                    } else {
                        toastInfo(false, 'Confirm failure.')
                    }
                    setLoading(false)
                    close()
                }).catch((error) => {
                    setLoading(false)
                    toastInfo(false, error.reason);
                })
            }).catch((error) => { 
                setLoading(false)
                toastInfo(false, error.reason);
            })
        } catch (error) {
            console.log(error)
            setLoading(false)
            if (error.code === -32603 && error.data.code == -32015) {
                toastInfo(false, 'Insufficient funds for gas.');
            } else {
                toastInfo(false, 'Confirm failure.')
            }
        }
    }

    return (
        <Box sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4
        }}>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <Typography variant={'secondary16'} color="text.secondary">
                        Amount
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <Button onClick={() => {
                            setBuyValue(10)
                        }} sx={{ minWidth: '20px' }}
                        >
                            10
                        </Button>
                        <Button onClick={() => {
                            setBuyValue(50)
                        }} sx={{ minWidth: '20px' }}
                        >
                            50
                        </Button>
                        <Button onClick={() => {
                            setBuyValue(100)
                        }} sx={{ minWidth: '20px' }}
                        >
                            100
                        </Button>
                        <Button onClick={() => {
                            setBuyValue(500)
                        }} sx={{ minWidth: '20px' }}
                        >
                            500
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}> 
                    <InputBase
                        sx={{
                            flex: 1, border: '1px solid #3c4454', borderRadius: 1, padding: '4px 10px',
                            backgroundColor: '#3f3d73'
                        }}
                        placeholder="0.00" 
                        value={buyValue}
                        autoFocus={true}
                        onChange={(e) => { 
                            setBuyValue(Number(e.target.value))
                        }}
                        inputProps={{
                            'aria-label': 'amount input',
                            style: {
                                fontSize: '18px',
                                lineHeight: '24,01px',

                                height: '24px',
                            },
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <Typography>share</Typography>
                            </InputAdornment>
                        }
                        // eslint-disable-next-line
                        inputComponent={NumberFormatCustom as any}
                    />

                </Box>
            </Box>

            <TxModalDetails> 
                <Row caption={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Typography color={'text.secondary'}>Shares Value</Typography>
                        <PriceTooltip />
                    </Box>
                } captionVariant="description" mb={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <Typography> <FormattedNumber value={buyPriceETH} variant="secondary14" compact visibleDecimals={4} symbol="CFX" /></Typography>
                        <Typography>
                            (<FormattedNumber value={buyPriceETH * (ethPrice ?? 0)} variant="secondary14" symbol='USD' />)
                        </Typography>

                    </Box>
                </Row>

            </TxModalDetails>

            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6 }}>
                <Button
                    variant={buyPriceETH > 0 ? "surface" : "contained"}
                    disabled={loading}
                    onClick={handleClick}
                    size="large"
                    sx={{
                        borderRadius: 2,
                        minHeight: '44px',
                    }}
                    data-cy="actionButton"
                >
                    {loading && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
                    {loading ? 'Signing' : 'Confirm Buy'}
                </Button>
            </Box>
        </Box>
    )
}