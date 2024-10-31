import { Button } from "@mui/material"
import { FormattedNumber } from "../../primitives/FormattedNumber"; 
import { useRootStore } from "@/src/store/root";  
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; 

export const ContentReplyCount = ({
    replyCount,
    handleClick,
}: {
    replyCount?: number, 
    handleClick?: () => void, 
}) => {
    const { account, setWalletModalOpen } = useRootStore()
 
    async function handleReply() {
        if (!account) {
            setWalletModalOpen(true)
        } else {
            handleClick && handleClick()
        }
    }

    return (
        <Button variant="text" startIcon={<ChatBubbleOutlineIcon />} sx={{
            padding: '2px 6px',
            minWidth: '20px'
        }}
            onClick={() => { handleReply() }}
        >
            <FormattedNumber
                value={replyCount??0}
                variant={'secondary16'}
                symbolsVariant={'secondary16'}
                visibleDecimals={0}
            />
        </Button>
    )
}