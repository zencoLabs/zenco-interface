import { Avatar, Box, Button } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { useMemo, useState } from 'react';
import { TitleWithSearchBar } from '../primitives/TitleWithSearchBar';
import { ModalType, useModalStore } from '@/src/store/modalSlice';
import { useRootStore } from '@/src/store/root';
import { getUserAvatar } from '@/src/utils/text-center-ellipsis';
import { spaceActive } from '@/src/utils/checkAddress';

export function TopDashbord() {
    const [searchTerm, setSearchTerm] = useState('');
    const { setType } = useModalStore();

    const { setWalletModalOpen, account, spaceUserInfo } = useRootStore();
    // const [open, setOpen] = useState(false);

    const { avatar, spacename } = useMemo(
        () => {
            return getUserAvatar(account, spaceUserInfo) //'https://arweave.net/J0EysabH0vBoX2g6wdPQ83VLADufVuZfcMJDgtxOl88'
        },
        [account, spaceUserInfo]
    );

    async function handleCreate() {
        if (!account) {
            setWalletModalOpen(true)
            return
        }

        const isActiveSpace = spaceActive(spaceUserInfo)
        if (!isActiveSpace) {
            setType(ModalType.UserInfo)
            return
        }

        setType(ModalType.BlogEditor)
    }
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center' 
        }}> 

            <Box sx={{
                display: 'flex',
                gap: 4
            }}> 
                <Avatar alt="" src={avatar} /> 
                <Button variant="surface"
                    size="medium"
                    startIcon={
                        <CreateIcon fontSize="small" />
                    }
                    onClick={() => { handleCreate() }}
                >Create</Button>
            </Box>

            <TitleWithSearchBar
                onSearchTermChange={setSearchTerm}
                title={
                    <>
                        <>assets</>
                    </>
                }
                searchPlaceholder={'Search asset'}
            />



        </Box>

    )
}