import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./urls";

export const fetch = async (ENDPOINT: string) => {
    const response = await axios.get(BASE_URL + ENDPOINT);
    console.log(response)
    return response.data;
};

export const getQuery = (ENDPOINT: string): any => {
    return useQuery({
        queryKey: [ENDPOINT],
        queryFn: () => fetch(ENDPOINT),
    });
};


export const submitData = async (ENDPOINT: string, data: any) => {
    const response = await axios.post(BASE_URL + ENDPOINT, data);
    console.log(response)
    return response.data;
};

export const postQuery = (ENDPOINT: string, data: any) => {
    return useMutation({
        mutationFn: () => submitData(ENDPOINT, data),
        mutationKey: [ENDPOINT],
        onSuccess: (responseData: any) => {
            console.log('Data submitted successfully:', responseData);
        },
        onError: (error: any) => {
            console.error('Error submitting data:', error);
        },
    });
}
