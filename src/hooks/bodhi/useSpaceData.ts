import { useRootStore } from "@/src/store/root";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useSpaceUsers = (userList: string[]) => { 
    const getSpaceUserInfo = useRootStore((store) => store.getSpaceUserInfo);
    const userSpaceQueries = useQueries({
        queries: userList.map((user: string) => ({
            queryKey: ['getuserlist', user],
            queryFn: () => getSpaceUserInfo(user),
            refetchInterval: 60000,
            // enabled: !!user,
        })),
    })
    return userSpaceQueries;
};


export const useAssetsByParent = (spaceAddress: string, assetId: number) => {
    const getAssetsByParent = useRootStore((store) => store.getAssetsByParent); 
    const assetIdQueries = useQuery({
        queryKey: ['getAssetsByParent', spaceAddress, assetId],
        queryFn: () => getAssetsByParent(spaceAddress,assetId),
        refetchInterval: 60000,
    })
    return assetIdQueries;
};

export const useSpaceAssetId = (spaceAddress: string) => {
    const getSpaceAssetId = useRootStore((store) => store.getSpaceAssetId); 
    const assetIdQueries = useQuery({
        queryKey: ['spaceAssetId', spaceAddress],
        queryFn: () => getSpaceAssetId(spaceAddress),
        // refetchInterval: 60000,
    })
    return assetIdQueries;
};
