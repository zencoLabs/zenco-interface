export interface TradeLog {
    _id: string;
    tradeType: number;
    assetId: number;
    parentAssetId: number;
    tokenAmount: string;
    ethAmount: string;
    creatorFee: string;
    from: string;
    to: string;
    arTxId: string;
    transactionHash: string;
    blockNumber: number;
    timestamp: number;
    isread: boolean
}

export interface CreateInfo {
    id: string;
    assetId: number;
    arTxId: string;
    sender: string;
    blockTimestamp: number;
    transactionHash: string;
}

export interface AssetInfo {
    assetId: number;
    isDelete?: boolean;
    totalFees?: number;
    totalHolders?: number;
    totalSupply?: number;
    totalTradValue?: number;
    totalTradVolume?: number;
    totalTrades?: number;
    creator?: {
        address: string;
    }
}
export interface UserInfo {
    id: string;
    address: string;
    isContract?: boolean;
    totalAssets?: number;
    totalFees?: number;
    totalHolders?: number;
    totalTradValue?: number;
    totalTradVolume?: number;
    totalTrades?: number;
}

export interface SpaceUserInfo2 {
    user?: string;
    spaceId?: string;
    spaceName?: string;
    descriptionAssetId?: string;
    avatarArTxId?: string;
    spaceAddress?: string;
}

export interface SpaceReply {
    id: string;
    sender: string;
    parentId: number;
    assetId: number;
    arTxId: string;
    isDelete: boolean;
    blockTimestamp: number;
    transactionHash: string;
    spaceFactory: SpaceUserInfo2
}

export interface SpaceFactoryUser {
    id: string;
    user?: string;
    spaceId?: string;
    spaceName?: string;
    descriptionAssetId?: string;
    avatarArTxId?: string;
    spaceAddress?: string;
    spaceAsset?: {
        totalFees?: number;
        totalHolders?: number;
        totalSupply?: number;
        totalTradValue?: number;
        totalTradVolume?: number;
        totalTrades?: number;
        isDelete?: boolean;
    },
    spaceUser?:{
        totalAssets?: number;
        totalFees?: number;
        totalHolders?: number;
        totalTradValue?: number;
        totalTradVolume?: number;
        totalTrades?: number;
    }
}