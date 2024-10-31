import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useRootStore } from "../store/root"; 
import { useBuyPrices } from "./bodhi/useBodhiData"; 

const GET_USERASSETS = gql`
query GetUserAssets($first: Int!, $skip: Int!, $address: String!) {
   userAssets(
    where: {user_: {address: $address}}
    orderBy: assetId
    orderDirection: desc
    skip: $skip
    first: $first
  ) {
    assetId
    amount
    user {
      address
    }
    asset {
      totalSupply
      totalTrades 
      totalFees
      totalHolders
      creator {
        address
        isContract
      }
    }
  }
}
`;


export default function useUserAssetInfo(address?: string) { 

  const { currentTimestamp } = useRootStore() //refetch
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 100;

  const { loading, error, data, refetch } = useQuery(GET_USERASSETS, {
    variables: { first: itemsPerPage, skip: currentPage * itemsPerPage, address: address },
  });

  const formattedData = !error && data ? data.userAssets
    .map((item: any) => ({
      assetId: item.assetId,
      amount: item.amount,
      userAddress: item.user.address,
      totalSupply: item.asset.totalSupply,
      totalTrades: item.asset.totalTrades,
      totalFees: item.asset.totalFees,
      totalHolders: item.asset.totalHolders,
      creatorAddress: item.asset.creator.address,
      isContract: item.asset.creator.isContract,
    }))
    .filter((item: any) => { 
      return item.isContract==false
    })
    : undefined;
 

  const buyPrices = useBuyPrices(formattedData ?? [])

  const combinedData = formattedData ? formattedData.map((item: any, index: number) => ({
    ...item,
    amountETH: buyPrices[index]?.data ?? 0
  })) : [];

  // amount sum
  const totalAmount = combinedData.reduce((sum: number, item: any) => sum + Number(item.amount), 0); 
  // amountETH * amount sum
  const totalAmountETH = combinedData.reduce((sum: number, item: any) => sum + (Number(item.amount) * Number(item.amountETH)), 0); 
  //
  const totalFees = combinedData.reduce((sum: number, item: any) => {
    if (item.userAddress === item.creatorAddress) {
      return sum + Number(item.totalFees);
    }
    return sum;
  }, 0); 
  const totalHolders =  combinedData.reduce((sum: number, item: any) => sum + Number(item.totalHolders), 0); 

 
  useEffect(() => {
    refetch();
  }, [currentTimestamp, refetch]);

  return {
    loading,
    userAssets: combinedData,
    totalAmount,
    totalAmountETH,
    totalFees,
    totalHolders
  };
}