import { useState} from 'react';
import { Box, Button, CircularProgress, Divider, LinearProgress, Typography } from '@mui/material'; 
import axios from 'axios';
// import 'react-image-crop/dist/ReactCrop.css'; 
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { useModalStore } from '@/src/store/modalSlice'; 
import { Contract } from 'ethers';
import bodhiABI from '@/src/abis/bodhi.json'; 
import { APIURL, BlogContract, ConnectChainID } from '@/src/libs/chains';
import { BigNumber } from 'ethers';
import { useRootStore } from '@/src/store/root';
import { toastInfo, toastInfo_Html } from '@/src/libs/toastAlert';
import { KeyboardArrowLeft } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useBackgroundDataProvider } from '@/src/hooks/BackgroundDataProvider'; 
import { RichEditorMobile } from './RichEditorMobile';
import { useRouter } from 'next/router'; 

export const BlogEditorContent = () => { 
    const router = useRouter();

    const { refetchBodhiData } = useBackgroundDataProvider()
    const { type, close } = useModalStore();
    const { signer, account } = useRootStore();
    const [content, setContent] = useState('');
    const [arweaveID, setArweaveID] = useState('');
    const [signing, setSigning] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);

    async function Confirm_Create() {
        if (!content || content.trim() === '' || content.trim() === '<p></p>' || content.trim() === '<p><br></p>') {
            toastInfo(false, 'Please enter text.')
            return
        }

        setActiveStep(1)
        setProgress(0)
        setSigning(true)
        if (arweaveID === '' || !arweaveID) {
            try {
                const response = await axios.post(APIURL.api_text, { text: content }); 
                if (response.status === 200) { 
                    setArweaveID(response.data.transactionId) 
                    handlSigningBodhi(response.data.transactionId) 

                } else {
                    toastInfo(false, 'Upload failed. Please try again.')
                    setSigning(false)
                }


            } catch (error) {
                console.error('Error uploading text:', error);
                setSigning(false)
            }

        } else {
            setTimeout(() => {
                handlSigningBodhi(arweaveID)
            }, 500);
        }

        const timer = setInterval(() => {
            setProgress((oldProgress) => { 
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };

    }

    // Handler to handle button clicked
    async function handlSigningBodhi(arTxId?: string) {

        if (!arTxId || arTxId == '' || arTxId == null) return;
        setSigning(true)

        const bodhiStr = BlogContract[ConnectChainID].bodhi
        const bodhiContract = new Contract(bodhiStr, bodhiABI, signer) //  

        try {
            const txObject = {
                from: account,
                to: bodhiStr, //  
                value: BigNumber.from(0),
                data: bodhiContract.interface.encodeFunctionData('create', [arTxId]), //  
            };
            const gasLimit = await bodhiContract.provider.estimateGas(txObject)
            console.log('gasLimit:', gasLimit.toNumber());

            const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

            sendPromise?.then((txResponse) => {
                //  console.log('Transaction hash:', txResponse.hash);

                //
                txResponse.wait().then((receipt) => {
                    // console.log('Transaction:', receipt);

                    if (receipt.status === 1) {

                        const msg = (
                            <div>
                                <strong>Bodhi Asset Posted.</strong>
                                <p>tx:{txResponse.hash}</p>
                            </div>
                        );
                        toastInfo_Html(true, msg)

                        refetchBodhiData && refetchBodhiData()

                        // setTimeout(() => {
                        //     closeDailog()
                        // }, 500);

                        router.push('/')

                    } else {
                        toastInfo(false, 'Signature failure.')
                    }
                    setSigning(false)

                    //initData(account)
                }).catch((error) => {
                    //  setLoading(false);
                    setSigning(false)
                    toastInfo(false, error.reason);
                })
            }).catch((error) => {
                // setLoading(false);
                setSigning(false)
                toastInfo(false, error.reason);
            })
        } catch (error) {
            setSigning(false)
            if (error.code === -32603 && error.data.code == -32015) {
                toastInfo(false, 'Insufficient funds for gas.');
            } else {
                toastInfo(false, 'Signature failure.')
            }
        }


    }

    function closeDailog() {
        setContent('')
        setActiveStep(0)
        setArweaveID('')
        setSigning(false)
        close()
    }

    return (<>
        {
            activeStep == 0 && (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      
                        <RichEditorMobile setContent={setContent} /> 
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        mt: 4,
                        justifyContent: 'center',
                        gap: 4
                    }}>
                         <Button variant={'outlined'} onClick={() => {
                           router.push('/')
                        }} sx={{ minWidth: '90px' }}
                            startIcon={
                                <KeyboardArrowLeft />
                            }>
                            <Typography variant="buttonM">
                                <>Back </>
                            </Typography>
                        </Button>
                        <Button variant={'surface'} onClick={() => { Confirm_Create() }} sx={{ minWidth: '120px' }}
                            disabled={signing}
                            startIcon={
                                signing && (
                                    <CircularProgress size={14} />
                                )
                            }
                        >
                            <Typography variant="buttonM">
                                Post now
                            </Typography>
                        </Button>
                    </Box>
                </>
            )
        }

        {
            activeStep == 1 && (
                <>
                    <TxModalTitle title="Space Preview" />
                    <Box sx={{ width: '100%' }}>
                        {
                            progress != 100 ? <><LinearProgress variant="determinate" value={progress} /></> :
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                                    <Typography variant={'main16'} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <CheckCircleIcon sx={{ color: '#78e378' }} />
                                        <>Uploaded</>
                                    </Typography>
                                    <Typography variant={'secondary14'} color={'text.secondary'}>
                                        Arweave ID: {arweaveID}
                                    </Typography>

                                    <Divider sx={{ mt: 2, mb: 2 }} />
                                    <Typography variant={'secondary16'} color={'text.primary'}>
                                        Waiting for signing...
                                    </Typography>
                                </Box>
                        }

                    </Box>

                    <Box sx={{
                        mt: 8,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4
                    }}>
                        <Button variant={'outlined'} onClick={() => {
                            setActiveStep(0)
                            setSigning(false)
                        }} sx={{ minWidth: '90px' }}
                            startIcon={
                                <KeyboardArrowLeft />
                            }>
                            <Typography variant="buttonM">
                                <>Back </>
                            </Typography>
                        </Button>
                        <Button variant={'surface'} onClick={() => { handlSigningBodhi(arweaveID) }} sx={{ minWidth: '90px' }}
                            disabled={signing}
                            startIcon={
                                signing && (
                                    <CircularProgress size={14} />
                                )
                            }
                        >
                            <Typography variant="buttonM">
                                <>{!signing ? 'Sign' : 'Signing'}</>
                            </Typography>
                        </Button>

                    </Box>
                </>
            )
        }

    </>

    );
};
