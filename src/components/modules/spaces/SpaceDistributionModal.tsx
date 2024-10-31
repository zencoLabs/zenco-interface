import { ModalType, useModalStore } from "@/src/store/modalSlice"
import { Box, Button, CircularProgress, Divider, InputAdornment, InputBase, Typography } from "@mui/material";
import { useState } from "react";
import { TempSpaceModal, useTempAssetStore } from "@/src/store/tempAssetSlice";
import { BasicModal } from "../../primitives/BasicModal";
import { useRootStore } from "@/src/store/root";
import { useBuyPrice } from "@/src/hooks/bodhi/useBodhiData";
import { FormattedNumber } from "../../primitives/FormattedNumber";
import { NumberFormatCustom } from "../../FlowCommons/AssetInput";
import { toastInfo } from "@/src/libs/toastAlert"; 
import { Contract, ethers } from "ethers";
import spaceABI from '@/src/abis/space.json';
import { useBackgroundDataProvider } from "@/src/hooks/BackgroundDataProvider";

export const SpaceDistributionModal = () => {
    const { type, close } = useModalStore();
    const { tempSpaceModal } = useTempAssetStore();

    async function closeDailog() {
        close()
    }

    return <>
        <BasicModal open={type === ModalType.SpaceDistribution} setOpen={closeDailog} contentMaxWidth={420}>
            <Typography variant="h2" sx={{ mb: 4 }}>
                Space #{tempSpaceModal?.spaceId}
            </Typography>

            {tempSpaceModal && (
                <>
                    <SpaceDistributionContent tempSpaceModal={tempSpaceModal} />
                </>
            )}

        </BasicModal>
    </>
}


export const SpaceDistributionContent = ({
    tempSpaceModal
}: {
    tempSpaceModal: TempSpaceModal;
}) => {
    const { refetchBodhiData } = useBackgroundDataProvider()

    const { account, ethPrice, signer, getBuyPriceAfterFee } = useRootStore()
    const { close } = useModalStore();
    const { data: sharePrice, error } = useBuyPrice(tempSpaceModal.assetId, tempSpaceModal.assetSupply)

    const [loading, setLoading] = useState(false);
    const [buyValue, setBuyValue] = useState(0);

    async function handleClick() {  
        setLoading(true)
        try {

            const spaceAddress = tempSpaceModal.spaceAddress!
            const spaceContract = new Contract(spaceAddress, spaceABI, signer) //  

            const price = getBuyPriceAfterFee(tempSpaceModal.assetId, buyValue, tempSpaceModal.assetSupply) 
            const maxPriceETHWEI = ethers.utils.parseEther(price.toString());
            const amountInWei = ethers.utils.parseUnits(buyValue.toString(), 18);

            const txObject = {
                from: account,
                to: spaceAddress, //  
                value: maxPriceETHWEI, //BigNumber.from(0),
                data: spaceContract.interface.encodeFunctionData('buyback', [amountInWei]), //  
            };
            const gasLimit = await spaceContract.provider.estimateGas(txObject) 

            const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

            sendPromise?.then((txResponse) => {  
                //
                txResponse.wait().then((receipt) => { 
                    if (receipt.status === 1) { 
                        toastInfo(true, 'Confirm Success.')

                        refetchBodhiData && refetchBodhiData()
                        close()
                    } else {
                        toastInfo(false, 'Confirm failure.')
                    }
                    setLoading(false)
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
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 8 }}>
                <Typography variant={'secondary16'} color={'text.secondary'}>
                    Avaliable to Distribute
                </Typography>
                <FormattedNumber value={tempSpaceModal.totalFees ?? 0} compact visibleDecimals={4} symbol="CFX" variant={"main21"} color={'text.primary'} symbolsColor={'text.primary'} />
                <FormattedNumber value={tempSpaceModal.totalFees ?? 0 * (ethPrice ?? 0)} variant={'secondary16'} compact visibleDecimals={3} symbol="USD" color={'text.secondary'} symbolsColor={'text.secondary'} />

                {
                    account && (account == tempSpaceModal.spaceCreator) ?
                        <>
                            <Divider sx={{ mt: 0, mb: 2, width: '100%' }} />
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, }}>
                                <Typography variant={'main16'} color={'text.primary'}>
                                    Current Price:
                                </Typography>
                                <FormattedNumber value={sharePrice ?? 0} variant={'main16'} symbolsVariant={"secondary14"} compact visibleDecimals={3} symbol="CFX/Share" symbolsColor={'text.primary'} />
                            </Box>
                            <Typography variant={'secondary16'} color={'text.secondary'}>
                                Buy space share with its own revenue
                            </Typography>

                            <Box sx={{ width: '100%', display: 'flex' }}>

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
                                            <Button
                                                variant={'contained'}
                                                onClick={() => {
                                                    setBuyValue(Number(tempSpaceModal.totalFees))
                                                }}
                                                sx={{ minWidth: '20px', padding: '0px 4px' }}
                                            >
                                                Max
                                            </Button>
                                        </InputAdornment>
                                    }
                                    // eslint-disable-next-line
                                    inputComponent={NumberFormatCustom as any}
                                />

                            </Box>

                        </>
                        : <></>
                }
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 8 }}>
                {
                    account && (account == tempSpaceModal.spaceCreator) ?
                        <Button
                            variant={tempSpaceModal?.totalFees ?? 0 > 0 ? "surface" : "contained"}
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
                            {loading ? 'Signing' : 'Buyback'}
                        </Button>
                        :

                        <Button
                            variant={tempSpaceModal?.totalFees ?? 0 > 0 ? "surface" : "contained"}
                            disabled={loading || (account != tempSpaceModal.spaceCreator)} 
                            size="large"
                            sx={{
                                borderRadius: 2,
                                minHeight: '44px',
                            }}
                            data-cy="actionButton"
                        >
                            {loading && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
                            {loading ? 'Signing' : 'Distribute to Space Holders'}
                        </Button>
                }

            </Box>


            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 8 }}>
                <Typography variant={'secondary16'} color={'text.secondary'}>
                    How does distribution work?
                </Typography>
            </Box>
            <Typography variant={'secondary14'} color={'text.secondary'} sx={{ padding: '6px' }}>
                Every space is a contract. When contract receives trading fees, it can use the funds to buy back its own shares, rewarding all holders. (Only space owner can trigger this action.)
            </Typography>
        </>
    )
}
