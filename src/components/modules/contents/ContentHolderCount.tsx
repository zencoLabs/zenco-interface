import { Button } from "@mui/material"
import { FormattedNumber } from "../../primitives/FormattedNumber";
import PermIdentityIcon from '@mui/icons-material/PermIdentity'; 
import { useRouter } from "next/router"; 

export const ContentHolderCount = ({
    assetId,
    holdersCount,
    handleClick,
}: {
    assetId: number,
    holdersCount?: number,
    handleClick?: () => void,
}) => {

    const router = useRouter(); 
    
    return (
        <Button variant="text" startIcon={<PermIdentityIcon />} sx={{
            padding: '2px 6px',
            minWidth: '20px'
        }}
            onClick={() => {
                handleClick && handleClick()
                router.push(`/asset-overview/?assetid=${assetId}`);
            }}
        >
            <FormattedNumber
                value={holdersCount ?? 0}
                variant={'secondary16'}
                symbolsVariant={'secondary16'}
                visibleDecimals={0}
            />
        </Button>
    )
}

