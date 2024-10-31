import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material" 
import { ModalType, useModalStore } from "@/src/store/modalSlice"; 
import { InputMultline } from "../../FlowCommons/InputMultiline";
import { useEffect, useState } from "react";
import { toastInfo } from "@/src/libs/toastAlert";
import axios from "axios";
import { APIURL } from "@/src/libs/chains";
import { useRootStore } from "@/src/store/root";
import { BigNumber, Contract } from "ethers";
import spaceABI from '@/src/abis/space.json';
import { useBackgroundDataProvider } from "@/src/hooks/BackgroundDataProvider"; 
import { TempAssetModal } from "@/src/store/tempAssetSlice";
import { ContentReplyItem } from "./ContentReplyItem";
import { useGetAssetReplyCounts, useGetAssetReplys } from "@/src/hooks/bodhi/useGraphData"; 
import { spaceActive } from "@/src/utils/checkAddress";


export const ContentReply = ({ 
    assetTempAssetModal, 
}: { 
    assetTempAssetModal: TempAssetModal, 
}) => {
    const { account, signer, setWalletModalOpen, spaceUserInfo, currentTimestamp } = useRootStore()
    const { setType } = useModalStore(); 
    const { refetchBodhiData } = useBackgroundDataProvider()

    const [replyContent, setReplyContent] = useState<string>('');
    const [signing, setSigning] = useState(false);
    const [arweaveID, setArweaveID] = useState('');

    const { loading: replyCountLoading, error: replyCountError, data: replyCountData, refetch: replyCountRefetch } = useGetAssetReplyCounts([assetTempAssetModal.assetId]);
    const { loading: assetReplyLoading, error: assetReplyError, data: assetReplyData, refetch: AssetReplyRefetch } = useGetAssetReplys(assetTempAssetModal.assetId);
  
    useEffect(() => {
        replyCountRefetch();
        AssetReplyRefetch();
    }, [currentTimestamp, replyCountRefetch, AssetReplyRefetch]);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyContent(e.target.value);
        if (arweaveID != '' && arweaveID.length > 0) {
            setArweaveID('')
        }
    };


    async function handlSigningReply() {
        if (!account) {
            setWalletModalOpen(true)
            return
        }

        const isActiveSpace = spaceActive(spaceUserInfo)
        if (!isActiveSpace) {
            setType(ModalType.UserInfo)
            return
        }


        if (!replyContent || replyContent === '') {
            toastInfo(false, 'Please enter a reply.')
            return
        }

        setSigning(true) 

        if (arweaveID === '' || !arweaveID) {
            try {
                const response = await axios.post(APIURL.api_text, { text: replyContent }); 
                if (response.status === 200) { 
                    setArweaveID(response.data.transactionId)
                    await doSigning(response.data.transactionId)

                } else {
                    toastInfo(false, 'Upload failed. Please try again.')
                    setSigning(false)
                }


            } catch (error) {
                console.error('Error uploading text:', error);
                setSigning(false)
            }

        } else {
            setTimeout(async () => {
                await doSigning(arweaveID)
            }, 500);
        }
    }

    async function doSigning(artx?: string) {
        if (!artx || artx == '') return;  
        const spaceAddress = assetTempAssetModal.spaceUserInfo?.spaceAddress?.toString()
        const bodhiContract = new Contract(spaceAddress!, spaceABI, signer) //   

        const txObject = {
            from: account,
            to: spaceAddress, //  
            value: BigNumber.from(0),
            data: bodhiContract.interface.encodeFunctionData('create', [artx, assetTempAssetModal.assetId]), //  
        };
        const gasLimit = await bodhiContract.provider.estimateGas(txObject)
        console.log('gasLimit:', gasLimit.toNumber());

        const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

        sendPromise?.then((txResponse) => { 
            //
            txResponse.wait().then((receipt) => { 
                if (receipt.status === 1) {
                    toastInfo(true, 'Thanks for the reply.')

                    refetchBodhiData && refetchBodhiData()
                    setReplyContent('')
                    setArweaveID('')
                } else {
                    toastInfo(false, 'Signature failure.')
                }
                setSigning(false)

            }).catch(() => { 
                setSigning(false)
            })
        }).catch(() => { 
            setSigning(false)
        })


    }


    return (
        <>
            <Divider sx={{ mt: 2, mb: 2 }} />

            <Box sx={{
                mt: 2,
                mb: 2
            }}>
                <InputMultline multiline
                    style={{
                        width: '100%',
                    }}
                    value={replyContent} onChange={handleTextareaChange} rows={3} />
                <Box sx={{
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'right',
                    gap: 4
                }}>
                    <Button variant={!replyContent ? 'contained' : 'surface'}
                        onClick={() => { handlSigningReply() }}
                        sx={{ minWidth: '90px' }}
                        disabled={signing || !replyContent}
                        startIcon={
                            signing && (
                                <CircularProgress size={14} />
                            )
                        }
                    >
                        <Typography variant="buttonM">
                            <>{!signing ? 'Reply' : 'Signing'}</>
                        </Typography>
                    </Button>

                </Box>

            </Box>

            <Typography sx={{ mb: 4 }}>Replies ({!replyCountLoading ? replyCountData?.spaceCounts.find((g: any) => g.parentId == assetTempAssetModal.assetId)?.count ?? 0 : 0})</Typography>
            <Box> 
                {
                    !assetReplyLoading ?
                        <>
                            {assetReplyData?.spaces.map((replyInfo: any, index: number) => (
                                <>
                                    <ContentReplyItem replyInfo={replyInfo} key={index} />
                                </>
                            ))}
                        </>
                        :
                        <>loading...</>
                }
            </Box>

        </>
    )
}

