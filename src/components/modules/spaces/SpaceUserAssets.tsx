import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { CreateInfo, SpaceUserInfo2 } from "@/src/libs/model";
import { bodhi_ApolloClient } from "@/src/apollo/client";
import { TrendItem } from "../trends/TrendItem";
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';

const GET_CREATES = gql`
  query GetCreates($first: Int!, $skip: Int!, $sender: String!) {
  creates(
      skip: $skip
      first: $first
       where: {  arTxId_not: "", isContract: false , sender: $sender }
      orderDirection: desc
      orderBy: blockTimestamp
    ) {
     id
     assetId
     arTxId
     sender
     blockTimestamp
     transactionHash
    }
  }
`;



export const SpaceUserAssets = ({
    spaceUserInfo
}: {
    spaceUserInfo?: SpaceUserInfo2;
}) => { 

    const [dataCreateArray, setDataCreateArray] = useState<CreateInfo[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;
    const loadedIds = useMemo(() => new Set(), []);

    const { loading, error, data, refetch } = useQuery(GET_CREATES, {
        variables: { first: itemsPerPage, skip: currentPage * itemsPerPage, sender: spaceUserInfo?.user },
        client: bodhi_ApolloClient,
    });


    useEffect(() => {
        if (data) { 
            const newCreates = data.creates.filter((create: CreateInfo) => !loadedIds.has(create.id));
            newCreates.forEach((create: CreateInfo) => loadedIds.add(create.id));
            setDataCreateArray((prev) => [...prev, ...newCreates]);
        }
    }, [data, loadedIds]);



    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        refetch();
    };



    return (
        <Box sx={{
            mt: 8
        }}>

            {dataCreateArray.map((create) => (
                <TrendItem key={create.id} create={create} />
            ))}

            {
                loading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress color="inherit" size={32} />
                    </Box>
                    :
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', mt: 4
                    }}>
                        {
                            data && data.creates.length == itemsPerPage ?
                                <Button onClick={handleLoadMore} endIcon={
                                    <UnfoldMoreDoubleIcon className="icon-animation" />
                                }>Load More</Button>
                                :
                                <Typography variant={'secondary16'} color={'text.secondary'}>No more.</Typography>
                        }
                    </Box>
            }

        </Box>
    )
}