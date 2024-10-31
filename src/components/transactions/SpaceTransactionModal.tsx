import { ModalType, useModalStore } from "@/src/store/modalSlice"
import { BasicModal } from "../primitives/BasicModal"
import { Typography } from "@mui/material"; 
import { useTempAssetStore } from "@/src/store/tempAssetSlice";
import { SpaceBuyContent } from "./SpaceBuyContent";
import { SpaceSellContent } from "./SpaceSellContent";

export const SpaceTransactionModal = () => {
    const { type, close } = useModalStore();
    const { tempSpaceModal } = useTempAssetStore();  


    async function closeDailog() {
        close()
    }
    return <>
        <BasicModal open={type === ModalType.SpaceBuy || type === ModalType.SpaceSell} setOpen={closeDailog} contentMaxWidth={420}>

            <Typography variant="h2" sx={{ mb: 4 }}>
                {type === ModalType.SpaceBuy ? 'Buy' : 'Sell'} space #{tempSpaceModal?.spaceId} 
            </Typography>


            {
                type === ModalType.SpaceBuy && (
                    <SpaceBuyContent assetId={tempSpaceModal?.assetId!} totalSupply={tempSpaceModal?.assetSupply ?? 0} />
                )
            }

            {
                type === ModalType.SpaceSell && (
                    <SpaceSellContent assetId={tempSpaceModal?.assetId!} totalSupply={tempSpaceModal?.assetSupply ?? 0} />
                )
            }


        </BasicModal>
    </>
}