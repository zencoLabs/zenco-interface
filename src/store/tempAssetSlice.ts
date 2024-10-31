import { create } from "zustand";
import { SpaceUserInfo2 } from "../libs/model";

export interface TempAssetModal {
    id: string;
    assetId: number;
    assetSupply: number;
    arTxId: string;
    sender: string;
    blockTimestamp: number;
    transactionHash: number;
    contentData?: string;
    spaceUserInfo?: SpaceUserInfo2;
    // isDelete?: boolean;
}
export interface TempSpaceModal {
    assetId: number;
    assetSupply: number;
    spaceId: number;
    spaceAddress?:string;
    spaceCreator?:string;
    totalFees?:number;
    totalTradValue?:number;
} 

export interface ModalSlice {
    tempAssetModal?: TempAssetModal;
    setTempAssetModal: (data?: TempAssetModal) => void;
    tempSpaceModal?: TempSpaceModal;
    setTempSpaceModal: (data?: TempSpaceModal) => void;
    tempSelectMemuIndex?: number;
    setTempSelectMemuIndex: (index: number) => void;
}

export const useTempAssetStore = create<ModalSlice>(set => ({
    setTempAssetModal(data) {
        set({ tempAssetModal: data });
    },
    setTempSpaceModal(data) {
        set({ tempSpaceModal: data });
    },
    setTempSelectMemuIndex(index) {
        set({ tempSelectMemuIndex: index });
    }
}))