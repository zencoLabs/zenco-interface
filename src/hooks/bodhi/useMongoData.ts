import { APIURL } from "@/src/libs/chains";
import { TradeLog } from "@/src/libs/model";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';


async function getTradelogs(address?: string): Promise<TradeLog[]> {
    const response = await axios.get(`${APIURL.api_url}/bodhi/tradelogs`, {
        params: { address }
    });
    return response.data.result;
}
 
export const useTradelogs = (address?: string) => {
    const { data: tradelogs, error } = useQuery<TradeLog[], Error>({
        queryKey: ['useTradelogs', address],
        queryFn: () => getTradelogs(address),
        refetchInterval: 60000,
    })
    return { tradelogs, error };
};


async function updateTradeLogIsRead(id: string): Promise<void> {
    try { 
        const response = await axios.post(`${APIURL.api_url}/bodhi/tradelog-upread`, { id });
        console.log(response.data.message);
    } catch (error) {
        console.error('Error updating trade log:', error);
    }
}

export const useUpdateTradeLog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTradeLogIsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['useTradelogs']
            }); 
        }
    });
};
