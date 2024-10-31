import { BasicModal } from '../primitives/BasicModal';
import { WalletSelector } from './WalletSelector';
import { useRootStore } from '@/src/store/root';

export const WalletModal = () => { 

    const {isWalletModalOpen,setWalletModalOpen} = useRootStore(state =>({ setWalletModalOpen: state.setWalletModalOpen, isWalletModalOpen: state.isWalletModalOpen }));
    
    return (
        <BasicModal  open={isWalletModalOpen} setOpen={setWalletModalOpen}>
            <WalletSelector />
        </BasicModal>
    );
};
