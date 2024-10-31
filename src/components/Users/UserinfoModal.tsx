import { useState, useRef, useMemo } from 'react';
import { Avatar, Box, Button, CircularProgress, Typography } from '@mui/material';
import ImageResizer from 'react-image-file-resizer';
import axios from 'axios'; 
import ReactCrop, { Crop } from 'react-image-crop'; 
import { BasicModal } from '../primitives/BasicModal';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ModalType, useModalStore } from '@/src/store/modalSlice';
import { useRootStore } from '@/src/store/root';
import { CustomInput } from '../FlowCommons/Input'; 
import { toastInfo } from '@/src/libs/toastAlert';
import { UserActiveSpace } from './UserActiveSpace';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { APIURL, BlogContract, ConnectChainID } from '@/src/libs/chains';
import { BigNumber, Contract, ethers } from 'ethers'; 
import spaceFactoryABI from '@/src/abis/spaceFactory.json';
import { useBackgroundDataProvider } from '@/src/hooks/BackgroundDataProvider'; 
import { getUserAvatar } from '@/src/utils/text-center-ellipsis';
import { spaceActive } from '@/src/utils/checkAddress';

export const UserinfoModal = () => {
    // const arweave = Arweave.init({});
    const { type, close, setType } = useModalStore();
    const [editSpace, setEditSpace] = useState<boolean>(false);
    const [editAvatar, setEditAvatar] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [spaceName, setSpaceName] = useState<string | undefined>(''); 
    const [arweaveID, setArweaveID] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { spaceUserInfo, account, signer } = useRootStore();
    const { refetchSpaceUserData } = useBackgroundDataProvider()

    const isActiveSpace = useMemo(
        () => {
            return spaceActive(spaceUserInfo)
        },
        [spaceUserInfo]
    );

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpaceName(e.target.value);
    };

    async function save_SpaceName() {

        try {
            const spaceStr = BlogContract[ConnectChainID].spaceFactory
            const spaceStrContract = new Contract(spaceStr, spaceFactoryABI, signer) //  

            const txObject = {
                from: account,
                to: spaceStr, //  
                value: BigNumber.from(0),
                data: spaceStrContract.interface.encodeFunctionData('updateSpaceName', [spaceName]), //  
            };
            const gasLimit = await spaceStrContract.provider.estimateGas(txObject)
            console.log('gasLimit:', gasLimit.toNumber());

            const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

            sendPromise?.then((txResponse) => { 

                //
                txResponse.wait().then((receipt) => { 
                    if (receipt.status === 1) {
                        refetchSpaceUserData && refetchSpaceUserData();
                        toastInfo(true, 'Space name updated successfully.')
                    } else {
                        toastInfo(false, 'Signature failure.')
                    }
                    setEditSpace(false)
                }).catch(() => {
                    setEditSpace(false)
                })
            }).catch(() => {
              
            })
        } catch (error) {

        }
    }
 
    const { avatar, spacename } = useMemo(
        () => {
            return getUserAvatar(account, spaceUserInfo) //'https://arweave.net/J0EysabH0vBoX2g6wdPQ83VLADufVuZfcMJDgtxOl88'
        },
        [account, spaceUserInfo]
    );

    const defaultCrop: Crop = {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        unit: 'px'
    }
    const [crop, setCrop] = useState<Crop>(defaultCrop);
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(defaultCrop);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setPreviewUrl(URL.createObjectURL(file));
            setFile(file);
        }
    };

    const onImageLoaded = (image: HTMLImageElement) => {
        imageRef.current = image;
    };

    const onCropComplete = (crop: Crop) => {
        setCompletedCrop(crop);
    };

    const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<File> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'croppedImage.jpg', { type: 'image/jpeg' });
                        resolve(file);
                    }
                }, 'image/jpeg');
            });
        }

        return Promise.reject(new Error('Failed to crop image'));
    };

    const handleMediaUpload = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); 
        if (!file || !completedCrop || !imageRef.current) { 
            toastInfo(false, 'Please select and crop an image to upload.')
            return;
        }
        setUploading(true)

        try {
            const croppedFile = await getCroppedImg(imageRef.current, completedCrop); 

            if (croppedFile.size < 100 * 100) {
                do_uploadImage(croppedFile)
            } else {
                ImageResizer.imageFileResizer(
                    croppedFile,
                    200,
                    200,
                    'JPEG',
                    100,
                    0,
                    async (resizedFile) => {
                        if (resizedFile instanceof File) {
                            do_uploadImage(resizedFile)
                        }
                    },
                    'file'
                );
            }


        } catch (error) {
            console.error('Error uploading file:', error);
            toastInfo(false, 'Error uploading file.')
        }
    };


    async function do_uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);


        const response = await axios.post(APIURL.api_media, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                // const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // console.log(`Upload progress: ${percentCompleted}%`);
            },
        });

        if (response.status === 200) {
            // setMessage(`File uploaded successfully: Transaction ID ${response.data.transactionId}`);
            setArweaveID(response.data.transactionId)
            sign_Avatar(response.data.transactionId)
        } else {
            toastInfo(false, 'Upload failed. Please try again.')
            setUploading(false)
        }

    }

    async function sign_Avatar(arTx?: string) {
        if (!arTx) return;

        try {
            const spaceStr = BlogContract[ConnectChainID].spaceFactory
            const spaceStrContract = new Contract(spaceStr, spaceFactoryABI, signer) //  

            const updateAvatarFee = ethers.utils.parseEther("0.1");
            const txObject = {
                from: account,
                to: spaceStr, //  
                value: updateAvatarFee,//BigNumber.from(0),
                data: spaceStrContract.interface.encodeFunctionData('uploadAvatar', [arTx]), //  
            };
            const gasLimit = await spaceStrContract.provider.estimateGas(txObject)
            console.log('gasLimit:', gasLimit.toNumber());

            const sendPromise = signer?.sendTransaction({ ...txObject, gasLimit });

            sendPromise?.then((txResponse) => { 

                //
                txResponse.wait().then((receipt) => {
                    // console.log('Transaction:', receipt); 
                    if (receipt.status === 1) {
                        refetchSpaceUserData && refetchSpaceUserData();
                        toastInfo(true, 'Avatar uploaded successfully.')
                    } else {
                        toastInfo(false, 'Signature failure.')
                    }
                    setEditAvatar(false)
                    setUploading(false)
                    setPreviewUrl(null)

                }).catch((error) => {
                    setUploading(false)
                    setEditAvatar(false)
                    toastInfo(false, error.reason);
                })
            }).catch((error) => {
                // setEditSpace(false)
                setUploading(false)
                setEditAvatar(false)
                toastInfo(false, error.reason);
            })
        } catch (error) {
            setUploading(false)
            setEditAvatar(false)
            if (error.code === -32603 && error.data.code == -32015) {
                toastInfo(false, 'Insufficient funds for gas.');
            } else {
                toastInfo(false, 'Signature failure.')
            }
        }
    }

    function closeDailog() {
        setEditSpace(false)
        setUploading(false)
        setEditAvatar(false)
        setPreviewUrl(null)
        close()
    }
    return (
        <BasicModal open={type === ModalType.UserInfo} setOpen={closeDailog} contentMaxWidth={520}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {
                    !isActiveSpace ? <>
                        <UserActiveSpace />
                    </> :
                        <>
                            <TxModalTitle title="Account" />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant={'secondary16'} color={'text.secondary'}>Space Id</Typography>
                                    <Box>
                                        <Typography variant={'secondary16'} color={'text.primary'} sx={{
                                            paddingRight: 10
                                        }}># {spaceUserInfo?.spaceId}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant={'secondary16'} color={'text.secondary'}>Space Name</Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 6,
                                        alignItems: 'center'
                                    }}>
                                        {
                                            !editSpace ? <>
                                                <Typography variant={'secondary16'} color={'text.primary'}>{spaceUserInfo?.spaceName}</Typography>
                                                <span onClick={() => {
                                                    setEditSpace(true)
                                                    setSpaceName(spaceUserInfo?.spaceName)
                                                }}> <BorderColorIcon fontSize={'small'} sx={{ color: '#75cedb' }} /></span>

                                            </>
                                                : <>
                                                    <CustomInput style={{ width: '100%' }} value={spaceName} onChange={handleTextChange} />
                                                    <Button variant={'outlined'} onClick={() => { save_SpaceName() }}>Save</Button>
                                                </>
                                        }


                                    </Box>

                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant={'secondary16'} color={'text.secondary'}>Avatar</Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 6,
                                        alignItems: 'center'
                                    }}>
                                        {
                                            !editAvatar ? <>
                                                <Avatar alt="" src={avatar} />
                                                <span onClick={() => {
                                                    setEditAvatar(true)
                                                }}> <BorderColorIcon fontSize={'small'} sx={{ color: '#75cedb' }} /></span>

                                            </>
                                                : <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                }}>
                                                    <div className="file-upload-container">
                                                        <label htmlFor="file-upload" className="file-upload-label">
                                                            Choose File
                                                        </label>
                                                        <input
                                                            id="file-upload"
                                                            type="file"
                                                            onChange={handleFileChange}
                                                            style={{ display: 'none' }}
                                                        />
                                                    </div>
                                                    <Button variant={'surface'} onClick={handleMediaUpload} sx={{ minWidth: '90px' }}
                                                        disabled={!previewUrl ? true : uploading}
                                                        startIcon={
                                                            uploading && (
                                                                <CircularProgress size={14} />
                                                            )
                                                        }
                                                    >
                                                        <Typography variant="buttonM">
                                                            <>Upload</>
                                                        </Typography>
                                                    </Button>
                                                </Box>
                                        }


                                    </Box>

                                </Box>

                                <Box>
                                    {previewUrl && (
                                        <div className="image-preview">
                                            <ReactCrop
                                                aspect={1 / 1}
                                                crop={crop}
                                                onComplete={onCropComplete}
                                                onChange={(newCrop) => setCrop(newCrop)}
                                            >
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    onLoad={(e) => onImageLoaded(e.currentTarget)}
                                                />
                                            </ReactCrop>
                                        </div>
                                    )}
                                </Box>
                            </Box> 
                        </>
                }

            </Box>
        </BasicModal>
    );
};
