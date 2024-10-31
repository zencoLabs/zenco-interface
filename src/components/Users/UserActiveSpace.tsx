import { Box, Button, CircularProgress, Divider, LinearProgress, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { CustomInput } from '../FlowCommons/Input';
import { InputMultline } from '../FlowCommons/InputMultiline';
import { useModalStore } from '@/src/store/modalSlice';
import { toastInfo } from '@/src/libs/toastAlert';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { APIURL, BlogContract, ConnectChainID } from '@/src/libs/chains';
import { BigNumber, Contract } from 'ethers';
import bodhiABI from '@/src/abis/bodhi.json';
import spaceFactoryABI from '@/src/abis/spaceFactory.json';
import { useRootStore } from '@/src/store/root';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useBackgroundDataProvider } from '@/src/hooks/BackgroundDataProvider';
import { useRouter } from 'next/router';

export type TxModalTitleProps = {
    title?: ReactNode;
    symbol?: string;
};

export const UserActiveSpace = () => {
    const { close } = useModalStore();
    const { signer, account, getBodhiUserAssets, getBodhiAssets, fetchArweaveData, spaceUserInfo } = useRootStore()
    const { refetchSpaceUserData } = useBackgroundDataProvider()
    const router = useRouter();


    const [spaceName, setSpaceName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [arweaveID, setArweaveID] = useState('');
    const [assetID, setAssetID] = useState<number | undefined>(); 
    const [signing, setSigning] = useState(false); 
    const [initSpace, setInitSpace] = useState(false);

    useEffect(() => {
        if (spaceUserInfo && spaceUserInfo.spaceName) {
            setSpaceName(spaceUserInfo.spaceName)
        }

        (async () => {
            if (account) {
                const assetId = await getBodhiUserAssets(account)
                if (assetId || assetId == 0) {
                    setAssetID(assetId)
                    const assetInfo = await getBodhiAssets(assetId ?? -1)
                    if (assetInfo) {
                        setArweaveID(assetInfo.arTxId!)
                        setInitSpace(true);//bodhi created

                        const _description = await fetchArweaveData(assetInfo.arTxId!)
                        setDescription(_description ?? '')
                    }
                } else {
                    if (initSpace) setInitSpace(false)
                }

            }

        })()
    }, [spaceUserInfo, account]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpaceName(e.target.value);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    async function Preview_1() {
        if (!spaceName || spaceName === '') {
            toastInfo(false, 'Please enter a space name.')
            return
        }
        if (spaceName.length > 32) {
            toastInfo(false, 'Maximum space name length is 32 strings.')
            return
        }
        if (!description || description === '') {
            toastInfo(false, 'Please enter a description.')
            return
        } 
        setActiveStep(1)
    }

    async function Confirm_Create() {
        setActiveStep(2)
        setProgress(0)

        setSigning(true)
        if (arweaveID === '' || !arweaveID) {
            try {
                const response = await axios.post(APIURL.api_text, { text: description }); 
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
                const diff = Math.random() * 20;
                return Math.min(oldProgress + diff, 100);
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };

    }


    // Handler to handle button clicked
    async function handlSigningBodhi(artx?: string) {
        if (!artx || artx == '') return;
        setSigning(true)

        const bodhiStr = BlogContract[ConnectChainID].bodhi
        const bodhiContract = new Contract(bodhiStr, bodhiABI, signer) //   

        try {
            const txObject = {
                from: account,
                to: bodhiStr, //  
                value: BigNumber.from(0),
                data: bodhiContract.interface.encodeFunctionData('create', [artx]), //  
            };
            const gasLimit = await bodhiContract.provider.estimateGas(txObject)
            console.log('gasLimit:', gasLimit.toNumber());

            const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

            sendPromise?.then((txResponse) => { 
                //
                txResponse.wait().then((receipt) => { 
                    if (receipt.status === 1) {
                        toastInfo(true, 'Bodhi Asset Created.')
                        setTimeout(() => {
                            handlSigningSpace()
                        }, 500);
                    } else {
                        toastInfo(false, 'Signature failure.')
                        setSigning(false)
                    }


                }).catch((error) => { 
                    setSigning(false)
                    toastInfo(false, error.reason);
                })
            }).catch((error) => { 
                setSigning(false)
                toastInfo(false, error.reason);
            })
        } catch (error) { 
            setSigning(false)
            if (error.code === -32603 && error.data.code == -32015) {
                toastInfo(false, 'Insufficient funds for gas.');
            } else {
                if (error.reason.toString() == 'execution reverted: Asset already exists') {
                    handlSigningSpace()
                } else {
                    toastInfo(false, 'Signature failure.')//'Signature failure.'
                }
            }
        } 
    }

    async function handlSigningSpace() {
        if (!spaceName || spaceName === '') {
            toastInfo(false, 'Please enter a space name.')
            return
        }

        setActiveStep(3)
        setSigning(true)

        const assetId = await getBodhiUserAssets(account)
        setAssetID(assetId)

        if (!assetId && assetId !== 0) {
            toastInfo(false, 'Refresh and try again.')
            return
        }

        const spaceStr = BlogContract[ConnectChainID].spaceFactory
        const spaceStrContract = new Contract(spaceStr, spaceFactoryABI, signer) //  

        const txObject = {
            from: account,
            to: spaceStr, //  
            value: BigNumber.from(0),
            data: spaceStrContract.interface.encodeFunctionData('create', [assetId, spaceName]), //  
        };
        const gasLimit = await spaceStrContract.provider.estimateGas(txObject)
        console.log('gasLimit:', gasLimit.toNumber());

        const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

        sendPromise?.then((txResponse) => { 

            //
            txResponse.wait().then((receipt) => { 
                if (receipt.status === 1) {
                    toastInfo(true, 'Space Created.') 
                    handleSpaceSuccess()
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

    async function handleSpaceSuccess() {
        refetchSpaceUserData && refetchSpaceUserData();
       
        setTimeout(() => {
            setActiveStep(4)
        }, 1500);
    }

    return (
        <Box>
            {
                activeStep == 0 && (
                    <>
                        <TxModalTitle title="Create a Space" />

                        <Box>
                            <Typography variant={'secondary16'} color={'text.secondary'}>Space Name</Typography>
                            <CustomInput style={{ width: '100%' }} value={spaceName} onChange={handleTextChange} />
                        </Box>
                        <Box sx={{
                            mt: 2,
                        }}>
                            <Typography variant={'secondary16'} color={'text.secondary'}>Description</Typography> 
                            <InputMultline multiline style={{ width: '100%' }} value={description} onChange={handleTextareaChange} rows={4} />
                        </Box>

                        <Box sx={{
                            mt: 8,
                            display: 'flex',
                            justifyContent: 'right',
                            gap: 4
                        }}>
                            <Button variant={'outlined'} onClick={() => { close() }} sx={{ minWidth: '90px' }}>
                                <Typography variant="buttonM">
                                    <>Cancel</>
                                </Typography>
                            </Button>
                            <Button variant={'outlined_2'} onClick={() => { Preview_1() }} sx={{ minWidth: '90px' }} 
                            >
                                <Typography variant="buttonM">
                                    <>Preview</>
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
                        <Box>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Space Name
                            </Typography>
                            <Typography variant={'h4'} component="div">
                                {spaceName}
                            </Typography>
                            <Box sx={{ mt: 4 }}>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Description
                                </Typography>
                                <Typography variant={'secondary14'} >
                                    <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }} />
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            mt: 8,
                            display: 'flex',
                            justifyContent: 'right',
                            gap: 4
                        }}>
                            <Button variant={'outlined'} onClick={() => { setActiveStep(0) }} sx={{ minWidth: '90px' }}
                                startIcon={
                                    <KeyboardArrowLeft />
                                }>
                                <Typography variant="buttonM">
                                    <>Back </>
                                </Typography>
                            </Button>
                            <Button variant={'surface'} onClick={() => {
                                initSpace ?
                                    handlSigningSpace()
                                    : Confirm_Create()
                            }} sx={{ minWidth: '90px' }}>
                                <Typography variant="buttonM">
                                    <>Confirm Create</>
                                </Typography>
                            </Button>

                        </Box>

                    </>
                )
            }

            {
                activeStep == 2 && (
                    <>
                        <TxModalTitle title="Create Space" />
                        <Box>
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
                                                Creating Bodhi Asset...
                                            </Typography>
                                        </Box>

                                }

                            </Box>

                        </Box>
                        <Box sx={{
                            mt: 8,
                            display: 'flex',
                            justifyContent: 'right',
                            gap: 4
                        }}>
                            <Button variant={'outlined'} onClick={() => {
                                setActiveStep(1)
                            }} sx={{ minWidth: '90px' }}
                                startIcon={
                                    <KeyboardArrowLeft />
                                }
                            >
                                <Typography variant="buttonM">
                                    <>Back</>
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

            {
                activeStep == 3 && (
                    <>
                        <TxModalTitle title="Create Space" />

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
                            <Typography variant={'main16'} sx={{
                                mt: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <CheckCircleIcon sx={{ color: '#78e378' }} />
                                <>Bodhi Asset Created</>
                            </Typography>
                            <Typography variant={'secondary14'} color={'text.secondary'}>
                                Asset lD: {assetID}
                            </Typography>

                            <Divider sx={{ mt: 2, mb: 2 }} />
                            <Typography variant={'secondary16'} color={'text.primary'}>
                                Creating Space...
                            </Typography>
                        </Box>
                        <Box sx={{
                            mt: 8,
                            display: 'flex',
                            justifyContent: 'right',
                            gap: 4
                        }}>
                            <Button variant={'outlined'} onClick={() => {
                                setActiveStep(2)
                            }} sx={{ minWidth: '90px' }}
                                startIcon={
                                    <KeyboardArrowLeft />
                                }
                            >
                                <Typography variant="buttonM">
                                    <>Back</>
                                </Typography>
                            </Button>
                            <Button variant={'surface'} onClick={() => { handlSigningSpace() }} sx={{ minWidth: '90px' }}
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

            {
                activeStep == 4 && (
                    <>
                        <TxModalTitle title=" " />

                        <Typography variant={'h2'} sx={{ pt: 8, pb: 8, textAlign: 'center' }}>
                            Space #{spaceUserInfo?.spaceId}  {spaceName}
                        </Typography>
                        <Box sx={{
                            mt: 8,
                            display: 'flex',
                            justifyContent: 'center',
                        }}>

                            <Button variant={'surface'} onClick={() => {
                                router.push(`/space-overview?address=${account}`);
                                close()
                            }} sx={{ minWidth: '90px' }}
                                disabled={signing}
                                endIcon={
                                    <ArrowForwardIcon />
                                }

                            >
                                Enter My Space
                            </Button>

                        </Box>

                    </>
                )
            }


        </Box>
    );
};
