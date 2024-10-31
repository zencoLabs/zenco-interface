
import { ModalType, useModalStore } from '@/src/store/modalSlice';
import { Box, Button } from '@mui/material';
import React from 'react';
import { BasicModal } from '../primitives/BasicModal';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../FlowCommons/ChangeNetworkWarning';
import { CHAINS, ConnectChainID } from '@/src/libs/chains';
 
 
export const SwitchNetworkModal = () => {
    const { type, close } = useModalStore() 
    return (
        <BasicModal open={type === ModalType.NetworkWarning} setOpen={close}>
            <TxModalTitle title={'Network error'} symbol={undefined} />

            <ChangeNetworkWarning networkName={CHAINS[ConnectChainID].name} />

            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 12 }}>
                <Button
                    variant={"surface"}
                    onClick={close}
                    size="large"
                    sx={{ minHeight: '44px', borderRadius: '40px' }}
                >
                    <>{'Cancel'}</>
                </Button>
            </Box>

        </BasicModal>
    );
};
