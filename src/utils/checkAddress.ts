import { JsonRpcProvider } from "@ethersproject/providers"; 
import { CHAINS, ConnectChainID } from "../libs/chains"; 
import { SpaceUserInfo2 } from "../libs/model";

async function isContractAddress(address: string, provider: JsonRpcProvider) {
    const code = await provider.getCode(address);
    return code.length > 2;
}

export async function checkEOAAddress(address: string) {
    const provider = new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])
    const isContract = await isContractAddress(address, provider);
    return isContract;
}

export async function checkEOAAddresses(addresses: string[]) {
    const provider = new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])
    const results = await Promise.all(addresses.map(async address => {
        const isContract = await isContractAddress(address, provider);
        return { address, isContract };
    }));
    return results;
}

export async function getTransactionInfo(hash: string) {
    const provider = new JsonRpcProvider(CHAINS[ConnectChainID].urls[0])

    const transaction = await provider.getTransaction(hash);
    return transaction
}

export function spaceActive(spaceUserInfo: SpaceUserInfo2 | undefined) {
    return !spaceUserInfo ? false :
        (
            !spaceUserInfo.spaceAddress || spaceUserInfo.spaceAddress == '' || spaceUserInfo.spaceAddress == '0x0000000000000000000000000000000000000000'
            || !spaceUserInfo.spaceName
        )
            ? false : true 
}