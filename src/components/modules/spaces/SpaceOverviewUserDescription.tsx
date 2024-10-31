import { useArweaveDatas } from "@/src/hooks/bodhi/useBodhiData";
import { useRootStore } from "@/src/store/root";
import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { useEffect } from "react";

const GET_CREATES = gql`
  query GetCreates($assetId: Int!) {
   creates(where: {assetId: $assetId}) {
     id
     assetId
     arTxId
     sender
     blockTimestamp
     transactionHash
    }
  }
`;

export const SpaceOverviewUserDescription = ({
    assetId, 
}: {
    assetId: number; 
}) => {
    const { currentTimestamp } = useRootStore() //refetch

    const {  data, refetch } = useQuery(GET_CREATES, {
        variables: { assetId: assetId }, 
    });

    useEffect(() => {
        refetch();
    }, [currentTimestamp, refetch]);

    const arTxIds = data?.creates
        ?.filter((create: { arTxId: string }) => create.arTxId !== '')
        .map((create: { arTxId: string }) => create.arTxId) || [];

    const arweaveQueries = useArweaveDatas(arTxIds) 

    return (
        <>
            {
                arweaveQueries.length > 0 && (
                    <Typography variant={'secondary14'} color={'text.secondary'} >
                        <div dangerouslySetInnerHTML={{ __html: arweaveQueries[0]?.data?.replace(/\n/g, '<br />') ?? '' }} />
                    </Typography>
                )
            }
        </>
    )
}