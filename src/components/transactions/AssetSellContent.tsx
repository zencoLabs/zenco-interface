import { Box, Button, CircularProgress, InputAdornment, InputBase, Typography } from "@mui/material"
import { TxModalDetails } from "../FlowCommons/TxModalDetails"
import { FormattedNumber } from "../primitives/FormattedNumber"
import { PriceTooltip } from "../infoTooltips/PriceTooltip"
import { Row } from "../primitives/Row"
import { NumberFormatCustom } from "../FlowCommons/AssetInput"
import { useEffect, useState } from "react"
import { useRootStore } from "@/src/store/root"
import { BlogContract, ConnectChainID } from "@/src/libs/chains"
import { BigNumber, Contract, ethers } from "ethers"
import bodhiABI from '@/src/abis/bodhi.json';
import { toastInfo } from "@/src/libs/toastAlert"
import { useModalStore } from "@/src/store/modalSlice"
import { useBackgroundDataProvider } from "@/src/hooks/BackgroundDataProvider"

export const AssetSellContent = ({
    assetId,
    totalSupply
}: {
    assetId: number;
    totalSupply: number;
}) => {
    const { refetchBodhiData } = useBackgroundDataProvider()
    const { close } = useModalStore();
    const { account, signer, getSellPriceAfterFee, getBalanceByAccount_Asset, ethPrice } = useRootStore()
    const [sellValue, setSellValue] = useState(0);
    const [balanceShares, setBalanceShares] = useState(0);
    const [sellPriceETH, setSellPriceETH] = useState(0);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (account) {
            (async () => {
                const balance = await getBalanceByAccount_Asset(account, assetId)
                setBalanceShares(balance ?? 0)
            })()
        }
    }, [assetId, account])


    useEffect(() => {
        if (sellValue && sellValue !== 0) {
            _getSellPriceAfterFee()
        } else {
            setSellPriceETH(0)
        }
    }, [sellValue])

    async function _getSellPriceAfterFee() {
        const price = await getSellPriceAfterFee(assetId, sellValue, totalSupply)
        setSellPriceETH(price ?? 0) 
    }

    function percentToValue(p: number) {
        setSellValue((balanceShares * p))
    }
    async function handleClick() {
        if (sellPriceETH == 0 || sellValue == 0) {
            return;
        }

        if (balanceShares == 0) {
            toastInfo(false, ' Insufficient balance.')
            return;
        }
        setLoading(true)
        try {

            const bodhiStr = BlogContract[ConnectChainID].bodhi
            const bodhiContract = new Contract(bodhiStr, bodhiABI, signer) //  

            // const buyPriceETHWEI = ethers.utils.parseEther(buyPriceETH.toString());
            const amountInWei = ethers.utils.parseUnits(sellValue.toString(), 18);

            const txObject = {
                from: account,
                to: bodhiStr, //  
                value: BigNumber.from(0),
                data: bodhiContract.interface.encodeFunctionData('sell', [assetId, amountInWei]), //  
            };
            const gasLimit = await bodhiContract.provider.estimateGas(txObject)
            console.log('gasLimit:', gasLimit.toNumber());

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
                            percentToValue(0.25)
                        }} sx={{ minWidth: '20px' }}
                        >
                            25%
                        </Button>
                        <Button onClick={() => {
                            percentToValue(0.5)
                        }} sx={{ minWidth: '20px' }}
                        >
                            50%
                        </Button>
                        <Button onClick={() => {
                            percentToValue(0.75)
                        }} sx={{ minWidth: '20px' }}
                        >
                            75%
                        </Button>
                        <Button onClick={() => {
                            percentToValue(1)
                        }} sx={{ minWidth: '20px' }}
                        >
                            Max
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <InputBase
                        sx={{
                            flex: 1, border: '1px solid #3c4454', borderRadius: 1, padding: '4px 10px',
                            backgroundColor: '#3f3d73'
                        }}
                        placeholder="0.00"
                        // disabled={disabled || disableInput}
                        value={sellValue}
                        autoFocus={true}
                        onChange={(e) => { 
                            setSellValue(Number(e.target.value))
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

                    <Box sx={{
                        padding: '0px 0px 0px 0px',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>


                        <Typography component="div" sx={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                        }}
                            variant={'secondary16'} color="text.secondary"
                        >

                            <>Balance: </>
                            <FormattedNumber
                                value={balanceShares}
                                compact
                                // variant="secondary12"
                                // color="text.secondary"
                                symbolsColor="text.disabled"
                            />
                        </Typography>

                    </Box>


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

                        <Typography> <FormattedNumber value={sellPriceETH} variant="secondary14" compact visibleDecimals={4} symbol="CFX" /></Typography>
                        <Typography>
                            (<FormattedNumber value={sellPriceETH * (ethPrice ?? 0)} variant="secondary14" symbol='USD' />)
                        </Typography>

                    </Box>
                </Row>

            </TxModalDetails>

            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6 }}>
                <Button
                    variant={sellPriceETH > 0 ? "surface" : "contained"}
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
                    {loading ? 'Signing' : 'Confirm Sell'}
                </Button>
            </Box>

        </Box>
    )
}