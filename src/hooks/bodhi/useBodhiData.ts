import { useRootStore } from "@/src/store/root";
import { checkEOAAddresses, getTransactionInfo } from "@/src/utils/checkAddress";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useArweaveDatas = (arTxIds: string[]) => {  
    const fetchArweaveData = useRootStore((store) => store.fetchArweaveData);
    const arweaveQueries = useQueries({
        queries: arTxIds.map((arTxId: string) => ({
            queryKey: ['arweaveData', arTxId],
            queryFn: () => fetchArweaveData(arTxId),
            refetchInterval: 60000,
        })),
    })
    return arweaveQueries;
};


export const useCheckEOAAddresses = (addresses: string[]) => {
    const { data: checkAddresses, error } = useQuery({
        queryKey: ['useCheckEOAAddresses', addresses],
        queryFn: () => checkEOAAddresses(addresses),
        refetchInterval: 60000,
    })

    return error ? undefined : checkAddresses;
};

export const useGetTransactionInfo = (hash: string) => {
    const { data: transactionHash, error } = useQuery({
        queryKey: ['useGetTransactionInfo', hash],
        queryFn: () => getTransactionInfo(hash),
        refetchInterval: 60000,
    })
    return error ? undefined : transactionHash;
};


export const useBuyPrices = (assetList: {
    assetId: number;
    totalSupply: number;
}[]) => {
    const getBuyPrice = useRootStore((store) => store.getBuyPrice);
    const buyPriceQueries = useQueries({
        queries: assetList.map((asset: {
            assetId: number;
            totalSupply: number;
        }) => ({
            queryKey: ['getBuyPrice', asset.assetId, asset.totalSupply],
            queryFn: () => getBuyPrice(asset.assetId, 1, asset.totalSupply),
            refetchInterval: 60000,
            // enabled: !!user,
        })),
    })
    return buyPriceQueries;
};


export const useBuyPrice = (assetId: number, totalSupply: number) => {
    const getBuyPrice = useRootStore((store) => store.getBuyPrice);
    const { data, error } = useQuery({
        queryKey: ['getBuyPrice', assetId, totalSupply],
        queryFn: () => getBuyPrice(assetId, 1, totalSupply),
        refetchInterval: 60000,
    })
    return { data, error };
};

export const useSellPrice = (assetId: number, totalSupply: number,currentTimestamp:number) => {
    const getSellPrice = useRootStore((store) => store.getSellPrice);
    const { data, error } = useQuery({
        queryKey: ['getSellPrice', assetId, totalSupply,currentTimestamp],
        queryFn: () => getSellPrice(assetId, 1, totalSupply),
        refetchInterval: 60000,
    })
    return { data, error };
};

export const useBalanceByAccount_Asset = (account: string,assetId: number,currentTimestamp:number) => {
    const getBalanceByAccount_Asset = useRootStore((store) => store.getBalanceByAccount_Asset);
    const { data, error } = useQuery({
        queryKey: ['getBalanceByAccount_Asset', assetId, account,currentTimestamp],
        queryFn: () => getBalanceByAccount_Asset(account, assetId),
        refetchInterval: 60000,
    })
    return { data, error };
};


