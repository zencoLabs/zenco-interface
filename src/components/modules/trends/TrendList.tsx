import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRootStore } from "@/src/store/root";
import { useQuery } from '@apollo/client';
import { GET_CREATES, useGetLatestCreate } from "@/src/hooks/bodhi/useGraphData";
import { bodhi_ApolloClient } from "@/src/apollo/client"; 
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';
import { TrendItem } from "./TrendItem";
import { CreateInfo } from "@/src/libs/model";

export function TrendList() {

    const { currentTimestamp } = useRootStore();

    const [dataCreateArray, setDataCreateArray] = useState<CreateInfo[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;
    const loadedIds = useMemo(() => new Set(), []);

    const { loading, error, data, refetch } = useQuery(GET_CREATES, {
        variables: { first: itemsPerPage, skip: currentPage * itemsPerPage },
        client: bodhi_ApolloClient,
    });

    const { data: latestCreateData, refetch: latestCreateRefetch } = useGetLatestCreate();
    useEffect(() => {
        refetch();
        latestCreateRefetch();
    }, [currentTimestamp, latestCreateRefetch]);

    useEffect(() => {
        if (data) { 
            const newCreates = data.creates.filter((create: CreateInfo) => !loadedIds.has(create.id));
            newCreates.forEach((create: CreateInfo) => loadedIds.add(create.id));
            setDataCreateArray((prev) => [...prev, ...newCreates]);
        } else { 
            setTimeout(() => {
                refetch()
            }, 500);
        }
    }, [data]);

    useEffect(() => {
        if (latestCreateData && latestCreateData.creates.length > 0) {
            const latestCreate = latestCreateData.creates[0];
            if (!loadedIds.has(latestCreate.id)) {
                loadedIds.add(latestCreate.id);
                setDataCreateArray((prev) => [latestCreate, ...prev]);
            }
        }
    }, [latestCreateData, loadedIds]);



    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1); 
    };
  
    return (<>

        {dataCreateArray.map((create) => (
            <TrendItem key={create.id} create={create} />
        ))}

        {
            loading ?
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress color="inherit" size={32} />
                </Box>
                :
                <Box sx={{
                    display: 'flex', justifyContent: 'center'
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

    </>)
}
