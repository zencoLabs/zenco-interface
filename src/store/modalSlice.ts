import { create } from "zustand"; 

export enum ModalType {
    NetworkWarning,
    UserInfo,
    BlogEditor,
    AssetBuy,
    SpaceBuy,
    SpaceSell,
    SpaceDistribution,
    SpaceInfo,
} 
export interface ModalSlice {
    close: () => void;
    type?: ModalType;
    setType: (_ModalType?: ModalType) => void; 
}

export const useModalStore = create<ModalSlice>(set => ({
    type: undefined,
    setType(_ModalType?: ModalType) {
        set({ type: _ModalType });
    },
    close() {
        set({ type: undefined });
    }, 
}))