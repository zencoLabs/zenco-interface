import { StateCreator } from "zustand";
import { RootStore } from "./root";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from '@ethersproject/contracts'
import { BlogContract, CHAINS, ConnectChainID } from "../libs/chains";
import bodhiABI from '@/src/abis/bodhi.json';
import spaceFactoryABI from '@/src/abis/spaceFactory.json'
import spaceABI from '@/src/abis/space.json'
import Arweave from "arweave";
import { BigNumber, ethers } from "ethers";
import dayjs from "dayjs"; 
import { SpaceUserInfo2 } from "../libs/model";
 
export interface BodhiAsset {
    id: number;
    arTxId?: string;
    creator?: string;
}

export interface BodhiSlice {
    // data: Map<number, Map<string, PoolReserve>>;
    currentTimestamp?: number,
    spaceUserInfo?: SpaceUserInfo2,
    refreshSpaceUserData: () => Promise<void>;
    refreshBodhiData: () => Promise<void>;
    getBodhiUserAssets: (account?: string) => Promise<number | undefined>;
    getBodhiAssets: (assetId: number) => Promise<BodhiAsset | undefined>;
    fetchArweaveData: (avatarTxId: string) => Promise<string | undefined>;
    getBalanceByAccount_Asset: (address: string, assetId: number) => Promise<number | undefined>;
    getPrice: (supply: number, amount: number) => BigNumber;
    getBuyPrice: (assetId: number, amount: number, totalSupply: number) => number;
    getSellPrice: (assetId: number, amount: number, totalSupply: number) => number;
    getBuyPriceAfterFee: (assetId: number, amount: number, totalSupply: number) => number;
    getSellPriceAfterFee: (assetId: number, amount: number, totalSupply: number) => number;
    getSpaceUserInfo: (account?: string) => Promise<SpaceUserInfo2 | undefined>;
    getAssetsByParent: (spaceAddress: string, assetId: number) => Promise<string[] | undefined>;
    getSpaceAssetId: (spaceAddress: string) => Promise<number | undefined>;
}

export const createBodhiSlice: StateCreator<
    RootStore,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
    [],
    BodhiSlice
> = (set, get) => {

    const arweave = Arweave.init({
        host: 'arweave.net',// Hostname or IP address for a Arweave host
        port: 443,          // Port
        protocol: 'https',  // Network protocol http or https
        timeout: 20000,     // Network request timeouts in milliseconds
        logging: false,     // Enable network request logging
    });

    const CREATOR_PREMINT = ethers.utils.parseUnits('1', 'ether'); // 1 ether
    const CREATOR_FEE_PERCENT = ethers.utils.parseUnits('0.05', 'ether'); // 5%

    // _curve function
    function _curve(x: BigNumber) {
        if (x.lte(CREATOR_PREMINT)) {
            return ethers.BigNumber.from(0);
        }
        const adjustedX = x.sub(CREATOR_PREMINT);
        return adjustedX.mul(adjustedX).mul(adjustedX);
    }

    return {
        refreshSpaceUserData: async () => {
            const account = get().account
            if (account) { 
                const spaceUserInfo = await get().getSpaceUserInfo(account)

                set({
                    spaceUserInfo: spaceUserInfo
                })
            } else {
                set({
                    spaceUserInfo: undefined
                })
            }
        },
        refreshBodhiData: async () => {
            set({
                currentTimestamp: dayjs().unix()
            }) 
        },
        //--------------------
        getBodhiUserAssets: async (account) => {
            const provider = (new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])) as Web3Provider
            const bodhiContract = new Contract(BlogContract[ConnectChainID].bodhi, bodhiABI, provider) //  
            try {
                const assetID = await bodhiContract.userAssets(account, 0).catch()
                return assetID.toNumber()
            } catch (error) {
                return undefined
            }
        },
        getBodhiAssets: async (assetID) => {
            const provider = (new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])) as Web3Provider
            const bodhiContract = new Contract(BlogContract[ConnectChainID].bodhi, bodhiABI, provider) //  
            try {
                const { id, arTxId, creator } = await bodhiContract.assets(assetID).catch() 
                return {
                    id: id.toNumber(),
                    arTxId,
                    creator
                }
            } catch (error) {
                return undefined
            }
        },
        getBalanceByAccount_Asset: async (address, assetId) => {
            const provider = (new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])) as Web3Provider
            const bodhiContract = new Contract(BlogContract[ConnectChainID].bodhi, bodhiABI, provider) //  
            try {
                const balanceWei = await bodhiContract.balanceOf(address, assetId).catch()
                const balanceInEther = ethers.utils.formatUnits(balanceWei, 18);

                return Number(balanceInEther)
            } catch (error) {
                return undefined
            }
        }, 
        getPrice: (supply, amount) => {
            const supplyInWei = ethers.utils.parseUnits(supply.toString(), 18);
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
            const price = _curve(supplyInWei.add(amountInWei)).sub(_curve(supplyInWei));
            return price.div(CREATOR_PREMINT).div(CREATOR_PREMINT).div(50000);
        },
        getBuyPrice: (assetId, amount, totalSupply) => {
            const priceInWei = get().getPrice(totalSupply, amount);
            const priceInEther = ethers.utils.formatUnits(priceInWei, 18);
            return parseFloat(priceInEther);
        },
        getSellPrice: (assetId, amount, totalSupply) => {
            const priceInWei = get().getPrice(totalSupply - amount, amount);
            const priceInEther = ethers.utils.formatUnits(priceInWei, 18);
            return parseFloat(priceInEther);
        },
        getBuyPriceAfterFee: (assetId, amount, totalSupply) => {

            const price = get().getBuyPrice(assetId, amount, totalSupply);
            const priceInWei = ethers.utils.parseUnits(price.toString(), 18);
            const creatorFee = priceInWei.mul(CREATOR_FEE_PERCENT).div(CREATOR_PREMINT);
            const result = priceInWei.add(creatorFee);
            const priceInEther = ethers.utils.formatUnits(result, 18);
            return parseFloat(priceInEther);
        },
        getSellPriceAfterFee: (assetId, amount, totalSupply) => {
            const price = get().getSellPrice(assetId, amount, totalSupply);
            const priceInWei = ethers.utils.parseUnits(price.toString(), 18);
            const creatorFee = priceInWei.mul(CREATOR_FEE_PERCENT).div(CREATOR_PREMINT);
            const result = priceInWei.sub(creatorFee);
            const priceInEther = ethers.utils.formatUnits(result, 18);
            return parseFloat(priceInEther);
        },

        //---------------------
        getSpaceUserInfo: async (account) => {
            if (account) {
                const provider = (new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])) as Web3Provider
                const spaceStrContract = new Contract(BlogContract[ConnectChainID].spaceFactory, spaceFactoryABI, provider) //   
                try {
                    const [spaceName, avatar, spaceAddress, spaceId] = await spaceStrContract.getUserSpaceInfo(account).catch()

                    const assetId = await get().getSpaceAssetId(spaceAddress.toString())

                    return { 
                        user: account,
                        spaceId: spaceId.toString(),
                        spaceName: spaceName,
                        descriptionAssetId: assetId?.toString(),
                        avatarArTxId: avatar,
                        spaceAddress: spaceAddress
                    }
                } catch (error) {
                    return undefined
                }
            } else {
                return undefined
            }
        },
        //---------------------
        fetchArweaveData: async (avatarTxId) => {
            try {
                if (!avatarTxId || avatarTxId == '') return undefined
                const data = await arweave.transactions.getData(avatarTxId, { decode: true, string: true });
                return data as string;
            } catch (error) {
                console.error('Error fetching avatar data from Arweave:', error);
                return undefined;
            }
        },
        getAssetsByParent: async (spaceAddress, assetId) => {
            const provider = (new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])) as Web3Provider
            const bodhiContract = new Contract(spaceAddress, spaceABI, provider) //  
            try {
                const list = await bodhiContract.getAssetsByParent(assetId).catch()
                return list
            } catch (error) {
                return undefined
            }
        },
        getSpaceAssetId: async (spaceAddress) => {
            const provider = (new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])) as Web3Provider
            const spaceContract = new Contract(spaceAddress, spaceABI, provider) //  
            try {
                const sapceAssetId = await spaceContract.spaceAssetId().catch()
                return sapceAssetId.toNumber()
            } catch (error) {
                return undefined
            }
        },

    };
};